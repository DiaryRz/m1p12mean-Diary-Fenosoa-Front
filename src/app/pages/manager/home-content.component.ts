import { Component } from '@angular/core';
import { AppointmentsChartComponent } from './statistics/appointments/appointments.component';
import { AmountsChartComponent } from './statistics/amounts/amounts.component';
import { ServicesChartComponent } from './statistics/services/services.component';

@Component({
  selector: 'app-home-content',
  imports:[AppointmentsChartComponent,AmountsChartComponent,ServicesChartComponent],
  templateUrl: './home-content.component.html',
})
export class HomeContentComponent {
}
