import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';


import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: '[notification-header]',
  imports: [ CommonModule , MaterialModule],
  templateUrl:'./notification.component.html' ,
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: any[] = [];
  unreadCount: number = 0;
  private notificationSubscription: Subscription;
  private unreadCountSubscription: Subscription;

  constructor(
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.updateNotifications()
  }
  private updateNotifications(){
    this.notificationSubscription = this.notificationService.notifications$
      .subscribe(notifications => {
        this.notifications = notifications;
        this.updateUnreadCount();
      });
    // Fetch unread count
    this.fetchUnreadCount();
  }

  private updateUnreadCount() {
    this.unreadCount = this.notifications.filter(n => !n.read).length;
  }

  private fetchUnreadCount() {
    this.notificationService.getUnreadCount()
      .subscribe(count => {
        this.unreadCount = count;
      });
  }

  onNotificationClick(notification: any) {
    // Mark as read
    console.log(notification);

    this.notificationService.markNotificationAsRead(notification._id)
      .subscribe(() => {
        this.updateNotifications()
      });
  }

  ngOnDestroy() {
    // Cleanup subscriptions
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
    if (this.unreadCountSubscription) {
      this.unreadCountSubscription.unsubscribe();
    }
  }
}
