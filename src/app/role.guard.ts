import { CanActivateChildFn , Router} from '@angular/router';
import { UserService } from './services/user.service'
import { inject } from '@angular/core'
import { map } from 'rxjs'

export const RoleGuard: CanActivateChildFn = (route, state) => {
  const userService = inject(UserService)
  const router = inject(Router)
  userService.verifyCurrentUser().subscribe(val=>{
    if ( val.error &&
      val.error.ok !=true) {
      router.navigateByUrl(`/login`)
    }
    if (localStorage.getItem('refreshToken') !== val.userId){
      localStorage.setItem('userId', val.userId)
    }
  })
  return userService.getCurrentUser().pipe(
    map(val => {
      const urlSegments = state.url.split('/').filter(segment => segment !== '');
      const baseRoute = urlSegments.length > 0 ? urlSegments[0] : '';
      if (!val.role_id) {
        router.navigateByUrl('/login');
        return false;
      }
      const userRole = val.role_id.role_name;
      if (baseRoute === userRole) {
        return true;
      }
      router.navigateByUrl(`/${userRole}`);
      return false;
    })
  );
};
