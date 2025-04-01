import { Component, Input} from '@angular/core';
import { VehicleInterface } from "src/app/pages/client/vehicles/create/vehicle.interface"
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: '[vehicle-item]',
  imports: [MaterialModule],
  templateUrl: './item.component.html',
})
export class VehicleItemComponent {
  @Input() vehicle: VehicleInterface;
}
