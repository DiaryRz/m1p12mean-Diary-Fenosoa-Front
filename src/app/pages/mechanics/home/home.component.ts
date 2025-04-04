import { Component, EventEmitter, Output, AfterViewInit,OnInit} from '@angular/core';
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
  mechanics_options: NavItem[];

  constructor() {
    this.mechanics_options = [
      {
        displayName: 'Rendez-vous', iconName: 'calendar-clock',
        children: [
          {
            displayName: 'Liste', iconName: 'menu-2', external: false, route: 'mechanics/appointments',
          },
          {
            displayName: 'Travail', iconName: 'tools', external: false, route: 'mechanics/works',
          }
        ]
      },
    ];
  }

  ngOnInit() {
    this.loadComponent.emit(this.mechanics_options);
  }
}
