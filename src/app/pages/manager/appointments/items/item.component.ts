import { Component, OnInit, Input, Output, EventEmitter, inject} from '@angular/core';
import { CommonModule , CurrencyPipe } from '@angular/common';
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

import { NotificationService } from 'src/app/services/notification.service';

import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

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
  constructor(
    private appointmentService: AppointmentService,
    private dateAdapter: DateAdapter<Date>,
    private notificationService: NotificationService,
  ) {}
  // @Input() appointment: AppointmentInterface;

  @Output() refetch = new EventEmitter<void>();
  @Input() appointment:any;

  confirm(id:string){
    this.appointmentService.confirmAppointment(id).subscribe((res:any )=>{
      if (res!.success) {
        const content =
          `Votre rendez-vous pour le ${format(this.appointment.date_appointment, 'PPPPp', { locale: fr }) }, à été validé.
          Veuillez payer ${ this.appointment.total_price * 0.5 } Ar (50%) pour confirmé le rendez-vous.,
          `;
        /* const content =
          `Votre rendez-vous pour le ${this.datetimeStringPipe.transform(this.appointment.date_appointment)||''} à été validé.
          Veuillez payer ${ this.currencyPipe.transform(( this.appointment.total_price * 0.5 ) , 'Ar')} (50%) pour confirmé le rendez-vous.,
          `; */

        this.notificationService.sendNotification(
          {
            recipient: this.appointment.id_user._id,

            message: {content: content, title: "Rendez-vous confirmé" },
          }
        );
        this.refetch.emit();
      }
    })
  }
}
