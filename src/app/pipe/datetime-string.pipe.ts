import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datetimeString',
  standalone: true // Add this if using Angular 14+ standalone components
})
export class DatetimeStringPipe implements PipeTransform {
  transform(value: string | number | Date): string {
    // Handle null/undefined
    if (value == null) return '';

    // Convert to Date object if not already
    const date = value instanceof Date ? value : new Date(value);

    // Check if date is valid
    if (isNaN(date.getTime())) return '';

    return date.toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(':', 'h');
  }
}
