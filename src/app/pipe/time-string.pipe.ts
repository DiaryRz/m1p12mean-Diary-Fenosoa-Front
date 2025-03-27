import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeString'
})
export class TimeStringPipe implements PipeTransform {

  transform(value: string | number): string {
    // Convert to number if it's a string
    const timestamp = typeof value === 'string' ? parseInt(value, 10) : value;
    if (isNaN(timestamp)) return ''; // Handle invalid numbers    const date = new Date(timestamp);
    const date = new Date(timestamp);

    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(':', 'h');
  }

}
