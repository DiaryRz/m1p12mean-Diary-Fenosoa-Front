import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module'

import {MatTimepickerModule} from '@angular/material/timepicker';
import { DateAdapter } from '@angular/material/core';

import { ConfigInterface } from './config.interface';
import { ConfigService } from 'src/app/services/config.service';

import { TimeStringPipe } from 'src/app/pipe/time-string.pipe'


@Component({
  selector: 'app-settings',
  standalone: true,
  imports:
  [
    CommonModule, FormsModule,
    MaterialModule, MatTimepickerModule,
    TimeStringPipe
  ],
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  config: ConfigInterface = {} as ConfigInterface;
  edit_mode: { edit: boolean, edit_value: ConfigInterface } = {
    edit: false,
    edit_value: {} as ConfigInterface
  };

  constructor(private configService: ConfigService,     private dateAdapter: DateAdapter<Date>) {}

  ngOnInit(): void {
    this.loadConfig();
  }

  loadConfig(): void {
    this.configService.getConfig().subscribe({
      next: (value: ConfigInterface) => {
        const hour= new Date(value.after_hour_appointment)
        this.config = {...value ,after_hour_appointment: hour };

        this.edit_mode = {
          edit: false,
          edit_value: { ...this.config } // Create a deep copy
        };
      },
      error: (err) => console.error('Error loading config:', err)
    });
  }

  onEdit(): void {
    this.edit_mode.edit = true;
    // Create a new copy for editing
    this.edit_mode.edit_value = { ...this.config };
  }

  isChanged(){
    return (
      this.dateAdapter.compareTime(this.edit_mode.edit_value.after_hour_appointment , this.config.after_hour_appointment) != 0
        ||this.config.max_appointment_per_day != this.edit_mode.edit_value.max_appointment_per_day
        ||this.config.offset_date_appointment != this.edit_mode.edit_value.offset_date_appointment
    )
  }

  onCancel(): void {
    this.edit_mode.edit = false;
    // Reset to original values
    this.edit_mode.edit_value = { ...this.config };
  }

  getDurationDisplay(value: unknown): string {
    const days = Number(value);
    if (isNaN(days)) return 'Invalid duration';

    const months = days / 30;
    const weeks  = days / 7;
    return `${days} jours | ${weeks.toFixed(0)} semaine(s) | ${months.toFixed(0)} mois`;
  }

  onSave(): void {

    this.configService.addConfig({...this.edit_mode.edit_value, after_hour_appointment:this.edit_mode.edit_value.after_hour_appointment.getTime()}).subscribe({
      next: (value: ConfigInterface) => {
        const hour= new Date(value.after_hour_appointment)
        this.config = {...value ,after_hour_appointment: hour };

        this.edit_mode = {
          edit: false,
          edit_value: { ...this.config } // Create a deep copy
        };
      },
      error: (err) => console.error('Error saving config:', err)
    });
  }
}
