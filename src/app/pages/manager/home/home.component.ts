import { Component, EventEmitter, Output, OnInit} from '@angular/core';
import { NavItem } from '../../../layouts/full/sidebar/nav-item/nav-item'
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule ],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  @Output() loadComponent = new EventEmitter<NavItem[]>();
  client_options: NavItem[] = [
      {navCap: 'Home', divider: true},
      {displayName: 'Acceuil'     , iconName: 'home'          , external: false , route: 'manager'},
      {displayName: 'Employés'    , iconName: 'user-filled'   , external: false , route: 'manager/employee'},
      {displayName: 'Rendez-vous' , iconName: 'calendar'      , external: false , route: 'manager/appointment'},
      {displayName: 'Services'    , iconName: 'tools'         , external: false , route: 'manager/history'},
      // {displayName: 'Statistique', iconName: 'chart-area'    , external: false , route: 'manager/'},
    ];
  ngOnInit(){
    this.loadComponent.emit(this.client_options);
  }
}
