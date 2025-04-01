import { Component, ViewChild, OnInit} from '@angular/core';
import { VehicleCreateComponent } from './create/create.component';
import { VehiclesListComponent } from './list/list.component';
import { VehicleService } from 'src/app/services/vehicle.service'
import { VehicleInterface } from "src/app/pages/client/vehicles/create/vehicle.interface"

@Component({
  selector: 'vehicles',
  imports: [ VehicleCreateComponent, VehiclesListComponent ],
  templateUrl: './vehicles.component.html',
})
export class VehiclesComponent implements OnInit {

  vehicles: VehicleInterface[] =[] as VehicleInterface[];

  constructor(private vehicleService: VehicleService){}

  @ViewChild('vehicleCreateForm') vehicleCreateForm!: VehicleCreateComponent;
  @ViewChild('vehiclesList') vehiclesList!: VehiclesListComponent;

  ngOnInit(){
    this.listVehicles();
  }

  listVehicles(){
    const userId = localStorage.getItem('userId') || "" ;
    this.vehicleService.listVehicles(userId).subscribe((value:any)=>{
      this.vehicles = value;
    })
  }

  VehicleCreate(){
    this.vehicleService.addVehicle({...this.vehicleCreateForm.form.getRawValue(), userId: localStorage.getItem('userId')})
      .subscribe((value:any)=>{
        this.vehicleCreateForm.form.patchValue({});
        this.vehiclesList.refetch.emit();
    });
  }
}
