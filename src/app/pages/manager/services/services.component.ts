import { Component , OnInit }                       from '@angular/core';
import { CommonModule }                             from '@angular/common';
import { MaterialModule }                           from 'src/app/material.module'
import { FormsModule }                              from '@angular/forms';

import { ServiceItem }                              from './services/service.interface'
import { ServiceItemComponent }                     from './services/items/item.component'
import { CreateItemComponent }                       from './services/create-item/create-item.component'

import { ServicesService }                          from 'src/app/services/services.service'


@Component({
  selector: 'app-services',
  imports: [ServiceItemComponent, CreateItemComponent ,MaterialModule ,FormsModule ,CommonModule ],
  templateUrl: './services.component.html',
})
export class ServicesComponent  implements OnInit{
  services : ServiceItem[];
  constructor(private serviceService: ServicesService){}
  ngOnInit(){
    this.serviceService.listServices().subscribe((val) => {
      console.log(val);
      this.services = val;
    });
  }

}
