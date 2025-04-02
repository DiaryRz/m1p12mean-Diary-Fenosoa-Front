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


import { DatetimeStringPipe } from 'src/app/pipe/datetime-string.pipe'
import { TimeStringPipe } from 'src/app/pipe/time-string.pipe'
import { PrettyJsonPipe } from 'src/app/pipe/pretty-json.pipe';
import { MinutesToHoursPipe } from 'src/app/pipe/minutes-to-hours.pipe'

import { AppointmentService } from 'src/app/services/appointment.service';
import { AppointmentInterface } from '../appointment.interface';

import { NotificationService } from 'src/app/services/notification.service';
import { PaymentService } from 'src/app/services/payment.service';

import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

@Component({
  selector: '[appointment-item]',
  imports:
  [
    CommonModule, FormsModule, ReactiveFormsModule,
    MaterialModule, MatTimepickerModule,
    // PrettyJsonPipe,
    MinutesToHoursPipe,
    DatetimeStringPipe,
    // TimeStringPipe
  ],
  templateUrl: './item.component.html',
})
export class AppointmentItemComponent implements OnInit {
  constructor(
    private fb:  FormBuilder,
    private appointmentService: AppointmentService,
    private dateAdapter: DateAdapter<Date>,
    private notificationService: NotificationService,
    private paymentService: PaymentService,
  ) {}
  @Input() appointment:any;
  @Input() dateFilter:any;
  @Input() timeFilter:any;
  @Input() context : string = '';
  @Output() refetch = new EventEmitter<void>();
  @ViewChild('payment_modal') payement_modal!: ElementRef<HTMLDialogElement>;
  @ViewChild('date_modal') date_modal!: ElementRef<HTMLDialogElement>;

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
        if (value && value.length > 9) {
          phone_numberField.setValue(value.slice(0 , 9), { emitEvent: false });
        } else {
          let filteredValue = value.replace(/[^0-9]/g, '');
          filteredValue = filteredValue.replace(/^261/g,'');

          if (filteredValue.startsWith('0')) {
            filteredValue = filteredValue.substring(1);
          }
          if (filteredValue !== value) {
            phone_numberField.setValue(filteredValue, { emitEvent: false });
          }
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

  pay(){
    if(this.appointment.total_payed == this.appointment.total_price *0.5){
      this.refetch.emit();
    }
    const phone_numberField = this._form.get('phone_number');
    let phone_number = phone_numberField!.value;
    if (phone_numberField) {
      if (phone_numberField.value && !phone_numberField.value.startsWith('261')) {
       phone_number = '261' + phone_numberField.value;
      }
    }

    this.paymentService.pay({ id_appointment: this.appointment._id ,userId : localStorage.getItem('userId'),...this.form.getRawValue(),phone_number : phone_number },true)
      .subscribe(( value : any )=>{
        //console.log(value.error);

        if (value.error?.error) {
          if(value.error.error.password == true){
            this.form.get('password')!.setErrors({ incorrect: true })
          }
          if(value.error.error.phone == true){
            this.form.get('phone_number')!.setErrors({ invalid: true })
          }
        }else{
          const content =
            `${this.appointment.id_user.firstname+ " " + this.appointment.id_user.name } à payer ${ this.appointment.total_price *0.50 } Ar (50%),
              pour le rendez-vous de ${ format(this.appointment.date_appointment, 'PPPPp', { locale: fr } )}` ;
          this.notificationService.sendNotification(
            {
              to_role: "manager",
              message: {content: content, title: "Payement (moitié)" },
            }
          );
          this.closeModal(this.payement_modal.nativeElement);
          this.form.patchValue({})
          this.refetch.emit();
        }
      })
  }

  log(value:any){
    console.log(value)
  }

  mark_as_delivered(){
    this.appointmentService.addDateDeposition(this.appointment._id).subscribe((value:any)=>{
      console.log(value);

      this.refetch.emit()
    })
  }
}
