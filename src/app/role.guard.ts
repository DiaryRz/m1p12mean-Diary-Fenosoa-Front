import { CanActivateChildFn , Router} from '@angular/router';
import { UserService } from './services/user.service'
import { inject } from '@angular/core'

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
  userService.getCurrentUser().subscribe(val => {
    const current_route = state.url.replace("/","")
    /* console.log(current_route);
    console.log(val); */
    if (!val.role_id) {
      router.navigateByUrl(`/login`)
      return false
    }
    if (val.role_id.role_name == current_route) {
      return true;
    }
    router.navigateByUrl(`/${val.role_id.role_name}`)
    return true
  })
  return true;
};
