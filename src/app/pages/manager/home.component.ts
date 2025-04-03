import { Component, EventEmitter, Output, OnInit} from '@angular/core';
import { NavItem } from 'src/app/layouts/full/sidebar/nav-item/nav-item'
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule ],
  template: `<title> Home | ReviveAuto </title>
@defer{
<router-outlet></router-outlet>
}@placeholder{
<div class="w-full rounded-lg h-full skeleton">
</div>
}@loading{
<div class="w-full rounded-lg h-full skeleton">
</div>
}
`,
})
export class HomeComponent implements OnInit {
  @Output() loadComponent = new EventEmitter<NavItem[]>();
  manager_options: NavItem[] = [];
  constructor(){
    this.manager_options=  [
      {navCap: 'Home', divider: true},
      {displayName: 'Employés'      , iconName: 'user-filled'   , external: false , route: 'manager/employee'       },
      {displayName: 'Configuration' , iconName: 'settings'      , external: false , route: 'manager/settings'       },
      {displayName: 'Services'      , iconName: 'tools'         , external: false , route: 'manager/services'       },
      {displayName: 'Rendez-vous'   , iconName: 'calendar'      , external: false , route: 'manager/appointments'   },
      // {displayName: 'Statistique', iconName: 'chart-area'    , external: false , route: 'manager/'},
    ];
  }
  ngOnInit(){
    this.loadComponent.emit(this.manager_options);
  }
}
