import { Component, EventEmitter, Output, AfterViewInit,OnInit, inject} from '@angular/core';
import { NavItem } from '../../../layouts/full/sidebar/nav-item/nav-item'
import { CommonModule } from '@angular/common';
import { RouterModule , Router} from '@angular/router';


@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule ],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  @Output() loadComponent = new EventEmitter<NavItem[]>();
  mechanics_options: NavItem[];
  router = inject(Router)


  constructor() {
    this.mechanics_options = [
      {
        displayName: 'Rendez-vous', iconName: 'calendar-clock',
        children: [
          {
            displayName: 'Liste', iconName: 'menu-2', external: false, route: 'mecanicien/appointments',
          },
          {
            displayName: 'Travail', iconName: 'tools', external: false, route: 'mecanicien/works',
          }
        ]
      },
    ];
  }

  ngOnInit() {
    this.loadComponent.emit(this.mechanics_options);
    this.router.navigate([`/mecanicien/appointments`]);
  }
}
