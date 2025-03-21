import { Component , Input ,
  ElementRef, ViewChild , inject }                  from '@angular/core';
import { DatePipe }                                 from '@angular/common';
import { FormsModule, NgModel }                     from '@angular/forms';
import { MaterialModule }                           from 'src/app/material.module';
import { UserService }                              from 'src/app/services/user.service'
import { ServiceItem }                              from '../service.interface'



@Component({
  selector: '[service-item]',
  imports: [],
  templateUrl: './item.component.html',
})
export class ServiceItemComponent {
  @Input() service_item : ServiceItem;

}
