import { Component, EventEmitter, Output, OnInit} from '@angular/core';
import { NavItem } from 'src/app/layouts/full/sidebar/nav-item/nav-item'
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule ],
  template: `<title> Home | ReviveAuto </title>
<router-outlet></router-outlet>
`,
})
export class HomeComponent implements OnInit {
  @Output() loadComponent = new EventEmitter<NavItem[]>();
  manager_options: NavItem[] = [
      {navCap: 'Home', divider: true},
      {displayName: 'Employés'    , iconName: 'user-filled'   , external: false , route: 'manager/employee'},
      {displayName: 'Rendez-vous' , iconName: 'calendar'      , external: false , route: 'manager/appointment'},
      {displayName: 'Services'    , iconName: 'tools'         , external: false , route: 'manager/services'},
      // {displayName: 'Statistique', iconName: 'chart-area'    , external: false , route: 'manager/'},
    ];
  ngOnInit(){
    this.loadComponent.emit(this.manager_options);
  }
}
