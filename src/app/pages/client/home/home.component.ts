import { Component, EventEmitter, Output, OnInit, inject} from '@angular/core';
import { NavItem } from '../../../layouts/full/sidebar/nav-item/nav-item'
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule ],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  private notificationService = inject(NotificationService);
  @Output() loadComponent = new EventEmitter<NavItem[]>();
  client_options: NavItem[] = [];
  constructor(){
    this.client_options = [
        {navCap: 'Acceuil', divider: true},
        {displayName: 'Rendez-vous', iconName: 'calendar-clock', external: false , route: 'client/appointment'},
        {displayName: 'Historique' , iconName: 'history'       , external: false , route: 'client/history'},
        {displayName: 'Vehicules'   , iconName: 'car'           , external: false , route: 'client/vehicles'},
      ];
  }
  ngOnInit(){
    this.loadComponent.emit(this.client_options);
  }

  test(){
    this.notificationService.sendNotification(
      {
        to_role: 'manager',
        message: {content: 'Real-time notification', title: "Test notif manager" },
      }
    );
  }

}
