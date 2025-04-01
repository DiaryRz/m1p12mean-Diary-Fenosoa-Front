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
      {displayName: 'Rendez-vous', iconName: 'calendar-clock', external: false , route: 'mechanics/appointments'},
    ];
  ngOnInit(){
    this.loadComponent.emit(this.client_options);
  }
}
