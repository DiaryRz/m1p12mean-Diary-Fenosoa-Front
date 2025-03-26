import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'find'
})
export class FindPipe implements PipeTransform {
  // Searches an array for a key-value match
  transform(items: any[], key: string, value: any): any {
    if (!items) return null;
    return items.find(item => item[key] === value);
  }
}
