import {
  Component,
  OnInit,
  Input, Output,
  ElementRef, EventEmitter,
  ViewChild, ViewContainerRef, AfterViewInit,
  inject  } from '@angular/core';
import { CommonModule , CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { MaterialModule } from 'src/app/material.module'

import { MatTimepicker, MatTimepickerModule } from '@angular/material/timepicker';
import { DateAdapter } from '@angular/material/core';
import { tap } from 'rxjs/operators';


import { DatetimeStringPipe } from 'src/app/pipe/datetime-string.pipe'
import { TimeStringPipe } from 'src/app/pipe/time-string.pipe'
import { PrettyJsonPipe } from 'src/app/pipe/pretty-json.pipe';
import { MinutesToHoursPipe } from 'src/app/pipe/minutes-to-hours.pipe'

import { AppointmentInterface } from '../appointment.interface';

import { AppointmentService } from 'src/app/services/appointment.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PaymentService } from 'src/app/services/payment.service';
import { WorksService } from 'src/app/services/works.service';

import { FindPipe } from 'src/app/pipe/find.pipe'

import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

@Component({
  selector: '[appointment-item]',
  imports:
  [
    CommonModule, FormsModule, ReactiveFormsModule,
    MaterialModule, MatTimepickerModule,
    MinutesToHoursPipe,
    DatetimeStringPipe,
    TimeStringPipe,
    FindPipe,
  ],
  templateUrl: './item.component.html',
})
export class AppointmentItemComponent implements OnInit {
  constructor(
    private fb:  FormBuilder,
    private appointmentService: AppointmentService,
    private dateAdapter: DateAdapter<Date>,
    private notificationService: NotificationService,
    private worksService: WorksService,
    private paymentService: PaymentService,
  ) {}

  @Input() appointment:any;
  @Input() dateFilter:any;
  @Input() timeFilter:any;
  @Input() context : string = '';
  @Output() refetch = new EventEmitter<void>();
  @ViewChild('payment_modal') payement_modal!: ElementRef<HTMLDialogElement>;
  @ViewChild('date_modal') date_modal!: ElementRef<HTMLDialogElement>;

  works : any[] = [];

  add_date_value = new Date();

  _form = this.fb.nonNullable.group({
    phone_number: [ '' , [ Validators.required ] ],
    code: [ '' , [ Validators.required ] ],
    password: [ '' , [ Validators.required ] ]
  })


  ngOnInit(){
    const phone_numberField = this._form.get('phone_number');

    if (phone_numberField) {
      phone_numberField.valueChanges.subscribe(value => {
        if (!value) return; // Skip if empty
        let filteredValue = value.replace(/[^0-9]/g, '');
        filteredValue = filteredValue.replace(/^261/g,'');

        if (filteredValue.startsWith('0')) {
          filteredValue = filteredValue.substring(1);
        }
        if (filteredValue !== value) {
          phone_numberField.setValue(filteredValue, { emitEvent: false });
        }
      });
    }

    const codeField = this._form.get('code');
    if (codeField) {
      codeField.valueChanges.subscribe(value => {
        if (value && value.length > 4) {
          codeField.setValue(value.slice(0 , 4), { emitEvent: false });
        } else {
          const filteredValue = value.replace(/[^0-9]/g, '');
          if (filteredValue !== value) {
            codeField.setValue(filteredValue, { emitEvent: false });
          }
          if (value.length < 4 ) {

          }
        }
      });
    }

    this.appointment.date_deposition = new Date(this.appointment.date_deposition)
    this.fetchWorks().subscribe();

  }

  fetchWorks(){
    return this.worksService.getByAppointmentId(this.appointment._id).pipe(
      tap((value: any) => {
        this.works = value.data;
      })
    );
  }

  // Open a modal
  openModal(modal: HTMLDialogElement) {

    //console.log(modal);
    modal.showModal();

  }
  // Close a modal
  closeModal(modal: HTMLDialogElement) {
    modal.close();
  }

  get form(): FormGroup{
    return this._form;
  }

  date_str(date:string){
    return new Date(date);
  }

  format_date(date:number ,f:string){
    return format(new Date(date), f)
  }

  add_date(){
    this.appointmentService.addDate(this.appointment._id, this.add_date_value).subscribe(
      (value:any)=>{
        this.refetch.emit();

      }
    );
  }

  mark_as_delivered(){
    this.appointmentService.addDateDeposition(this.appointment._id).subscribe((value:any)=>{
      console.log(value);

      this.refetch.emit()
    })
  }

  getWorkForService(serviceId: string) {
    return this.works.find(w => w.id_service === serviceId);
  }

  begin_service_work(id_service:string){
    const id_user:string = localStorage.getItem('userId') || '';
    this.worksService.createWork(id_user,this.appointment._id ,id_service ).subscribe((value:any)=>{
      this.fetchWorks();
    })
  }

  mark_work_as_done(id_work: string) {
    const updateData = {
      status: 'done',
      datetime_service_end: Date.now()
    };

    this.worksService.updateWork(id_work, updateData).subscribe({
      next: (val: any) => {
        console.log('Work updated:', val);
        this.refreshWorksAndCheckCompletion();
      },
      error: (err) => {
        console.error('Error updating work:', err);
        // Handle error (show toast, etc.)
      }
    });
  }

  private refreshWorksAndCheckCompletion() {
    this.fetchWorks().subscribe({
      next: (val) => {
        console.log(val);

        if (this.isAppointmentDone()) {
          this.sendCompletionNotification();
          this.updateAppoitmentCompletion();
        }
      },
      error: (err) => console.error('Error fetching works:', err)
    });
  }

  private isAppointmentDone(): boolean {
    const ok = this.works.every(work => work.status === 'done');
    return ok;
  }

  private sendCompletionNotification() {
    const carInfo = `${this.appointment.id_car.mark}-${this.appointment.id_car.model} (${this.appointment.id_car.immatriculation})`;
    const remainingPayment = this.appointment.total_price * 0.5;

    const notification = {
      recipient: this.appointment.id_user._id,
      message: {
        title: 'Réparation terminée',
        content: `Votre rendez-vous et les services ont été effectués.
                  Voiture: ${carInfo}
                  Veuillez payer le reste (${remainingPayment} Ar) pour pouvoir récupérer votre voiture.`
      }
    };
    this.notificationService.sendNotification(notification);
  }

  private updateAppoitmentCompletion() {
    this.appointmentService.update(this.appointment._id, { status: 'finis' }).subscribe({
      next: (value:any)=>{ console.log(value) , this.refetch.emit();}
    })
  }

}
