import { CanActivateFn , Router} from '@angular/router';
import { UserService } from 'src/app/services/user.service'
import { inject } from '@angular/core'

export const ManagerGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService)
  const router = inject(Router)
  userService.verifyCurrentUser().subscribe(val=>{
    if ( val.error &&
      val.error.success !=true) {
      router.navigateByUrl(`/employee/login`)
    }
    localStorage.setItem('accessToken', val.accessToken)
    if (localStorage.getItem('userId') !== val.userId){
      localStorage.setItem('userId', val.userId)
    }
  })
  userService.getCurrentUser().subscribe(val => {
    if (!val.role_id) {
      router.navigateByUrl(`/employee/login`)
      return false
    }
    if (val.role_id.role_name == 'manager') {
      return true;
    }
    router.navigateByUrl(`/${val.role_id.role_name}`)
    return true
  })
  return true;
};
