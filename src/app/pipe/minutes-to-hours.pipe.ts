import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minutesToHours'
})
export class MinutesToHoursPipe implements PipeTransform {
  transform(minutes: number): string {
    if (isNaN(minutes)) return '00:00'; // Handle invalid input

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    // Format as "HH:MM" (e.g., 90 mins → "1:30")
    return `${hours}h${mins.toString().padStart(2, '0')}mn`;
  }
}
