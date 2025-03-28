import { Component, OnInit ,Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module'

import { MatTimepickerModule } from '@angular/material/timepicker';
import { DateAdapter } from '@angular/material/core';

import { DatetimeStringPipe } from 'src/app/pipe/datetime-string.pipe'
import { TimeStringPipe } from 'src/app/pipe/time-string.pipe'
import { PrettyJsonPipe } from 'src/app/pipe/pretty-json.pipe';
import { MinutesToHoursPipe } from 'src/app/pipe/minutes-to-hours.pipe'

import { AppointmentService } from 'src/app/services/appointment.service';
import { AppointmentInterface } from '../appointment.interface';


@Component({
  selector: '[appointment-item]',
  standalone: true,
  imports:
  [
    CommonModule, FormsModule,
    MaterialModule, MatTimepickerModule,
    // PrettyJsonPipe,
    MinutesToHoursPipe,
    DatetimeStringPipe,
    // TimeStringPipe
  ],
  templateUrl: './item.component.html',
})
export class AppointmentItemComponent{
  constructor( private appointmentService: AppointmentService, private dateAdapter: DateAdapter<Date> ) {}
  // @Input() appointment: AppointmentInterface;
  @Input() appointment:any;

}
