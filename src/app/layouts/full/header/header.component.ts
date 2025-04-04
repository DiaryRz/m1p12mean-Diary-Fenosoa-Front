import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule , Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatBadgeModule } from '@angular/material/badge';


import { AuthService } from '../../../services/auth.service'
import { NotificationComponent } from './notification/notification.component'

@Component({
  selector: 'app-header',
  imports: [
    RouterModule,
    CommonModule,
    NgScrollbarModule,
    TablerIconsModule,
    MaterialModule,
    MatBadgeModule,
    NotificationComponent
  ],
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  private authService = inject(AuthService)
  private router = inject(Router)
  logout(){
    this.authService.logout().subscribe( response =>{
      const role = localStorage.getItem('role');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('role');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userId');
      this.router.navigate([ `${role == 'client' ? '' : '/employee'} /login`]);
    })
  }
}
