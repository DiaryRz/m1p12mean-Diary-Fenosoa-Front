import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap} from 'rxjs/operators';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private socket: Socket ;
  private readonly serverUrl = environment.apiUrl;
  private notificationsSubject = new BehaviorSubject<any[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();
  private unreadNotificationsSubject = new BehaviorSubject<any[]>([]);
  public unreadNotifications$ = this.unreadNotificationsSubject.asObservable();


  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.initSocketConnection();
  }

  private initSocketConnection() {
    this.authService.verify().subscribe(authResult => {
      if (authResult.success) {
        // Proper Socket.IO configuration
        this.socket = io(this.serverUrl, {
          path: '/socket.io',
          transports: ['websocket', 'polling'], // Explicitly specify transports
          auth: {
            token: localStorage.getItem('accessToken')
          },
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000
        });

        this.socket.on('connect', () => {
          this.socket?.emit('get-initial-notifications');
        });

        this.socket.on('connect_error', (err) => {
          console.error('Connection error:', err);
        });

        this.socket.on('initial-notifications', (notifications: any[]) => {
          this.notificationsSubject.next(notifications);
        });

        this.socket.on('new-notification', (notification: any) => {
          const currentNotifications = this.notificationsSubject.value;
          this.notificationsSubject.next([notification, ...currentNotifications]);
        });

        this.socket.on('disconnect', (reason) => {
          console.log('Socket disconnected:', reason);
        });
      }
    });
  }

  // Listen for events from server
  listen(eventName: string): Observable<any> {
    return new Observable((subscriber) => {
      if (this.socket) {
        this.socket.on(eventName, (data) => {
          subscriber.next(data);
        });
      }
    });
  }
  // Emit events to server
  emit(eventName: string, data: any): void {
    this.socket.emit(eventName, data);
  }

  async sendNotification(options: {
    recipient?: string,
    to_role?: string,
    message: { title: string, content: string }
  }): Promise<void> {
    if (!options.recipient && !options.to_role) {
      throw new Error('Must specify recipient or room');
    }

    return new Promise((resolve, reject) => {
      this.socket!.emit('send-notification', {
        recipientId: options.recipient,
        to_role: options.to_role,
        message_string: JSON.stringify(options.message)
      }, (response: { success: boolean, error?: string }) => {
        if (response.success) {
          resolve();
        } else {
          reject(response.error || 'Failed to send notification');
        }
      });
    });
  }

  markAllNotificationsAsRead(): Observable<any> {
    return this.http.patch(`${this.serverUrl}/notifications/read-all`, {}).pipe(
      catchError(this.handleError)
    );
  }

  markNotificationAsRead(notificationId: string): Observable<any> {
    return this.http.patch(`${this.serverUrl}/notifications/${notificationId}/read`, {}).pipe(
      tap(() => {
        // Update local state immediately for better UX
        const updatedNotifications = this.notificationsSubject.value.map(n =>
          n._id === notificationId ? {...n, read: true} : n
        );
        this.notificationsSubject.next(updatedNotifications);
        this.updateUnreadNotifications();
      }),
      catchError(this.handleError)
    );
  }

  getUnreadCount(): Observable<number> {
    return this.http.get<{count: number}>(`${this.serverUrl}/notifications/unread-count`).pipe(
      map(response => response.count),
      catchError(() => of(0))
    );
  }

  private updateUnreadNotifications() {
    const unread = this.notificationsSubject.value.filter(n => !n.read);
    this.unreadNotificationsSubject.next(unread);
  }

  // Modify the initial-notifications handler
  private setupSocketListeners() {
    // ... existing code ...

    this.socket.on('initial-notifications', (notifications: any[]) => {
      this.notificationsSubject.next(notifications);
      this.updateUnreadNotifications();
    });

    this.socket.on('new-notification', (notification: any) => {
      const currentNotifications = this.notificationsSubject.value;
      const updatedNotifications = [notification, ...currentNotifications];
      this.notificationsSubject.next(updatedNotifications);

      if (!notification.read) {
        const currentUnread = this.unreadNotificationsSubject.value;
        this.unreadNotificationsSubject.next([notification, ...currentUnread]);
      }
    });
  }


  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return of({ error: error.error?.error || 'Something went wrong' });
  }

  // Disconnect
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
