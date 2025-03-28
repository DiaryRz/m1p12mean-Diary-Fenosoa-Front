import { Pipe, PipeTransform } from '@angular/core';
import { format } from 'date-fns';

@Pipe({
  name: 'datetimeString'
})
export class DatetimeStringPipe implements PipeTransform {

  transform(value: string | number): string {
    // Convert to number if it's a string
    const timestamp = typeof value === 'string' ? parseInt(value, 10) : value;
    if (isNaN(timestamp)) return ''; // Handle invalid numbers    const date = new Date(timestamp);
    const date = new Date(timestamp);

    return date.toLocaleString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).replace(':', 'h');
  }

}
