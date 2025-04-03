import { Component ,ViewChild ,inject, EventEmitter, OnInit, Output, Input } from '@angular/core';

import { VehicleService } from 'src/app/services/vehicle.service'
import { VehicleInterface } from "src/app/pages/client/vehicles/create/vehicle.interface"
import { VehicleItemComponent } from './item/item.component'
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'vehicles-list',
  imports: [ VehicleItemComponent , MaterialModule],
  templateUrl: './list.component.html',
})
export class VehiclesListComponent {

  @Output() refetch = new EventEmitter<void>();

  @Input() vehicles: VehicleInterface[] = [] as VehicleInterface[];
  constructor(private vehicleService: VehicleService){}
}
