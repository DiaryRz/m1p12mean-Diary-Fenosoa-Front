import { Component, EventEmitter, Output, OnInit, inject} from '@angular/core';
import { NavItem } from '../../../layouts/full/sidebar/nav-item/nav-item'
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule ],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  @Output() loadComponent = new EventEmitter<NavItem[]>();
  client_options: NavItem[] = [];

  router = inject(Router)

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
    this.router.navigate([`/client/history`]);
  }


}
