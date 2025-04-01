import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prettyJson',
  standalone: true // For Angular 17+ standalone components
})
export class PrettyJsonPipe implements PipeTransform {
  transform(value: any, indentSpaces: number = 2): string {
    if (value === null || value === undefined) {
      return '';
    }

    try {
      // Handle strings (parse if they're JSON)
      const parsedValue = typeof value === 'string' ? JSON.parse(value) : value;
      return JSON.stringify(parsedValue, null, indentSpaces);
    } catch (e) {
      //console.error('Failed to parse JSON:', e);
      return typeof value === 'string' ? value : JSON.stringify(value);
    }
  }
}
