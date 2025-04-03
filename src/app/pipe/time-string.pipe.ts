import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeString'
})
export class TimeStringPipe implements PipeTransform {

  transform(value: string | number | Date): string {
    // Handle null/undefined
    if (value == null) return '';

    // Convert to Date object if not already
    const date = value instanceof Date ? value : new Date(value);

    // Check if date is valid
    if (isNaN(date.getTime())) return '';

    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(':', 'h');
  }

}
