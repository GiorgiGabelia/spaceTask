import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'camelCaseToTitleCase',
})
export class CamelCaseToTitleCasePipe implements PipeTransform {
  transform(camelCaseVal: string): string {
    if (!camelCaseVal) return '';

    return camelCaseVal
      .replace(/([A-Z])/g, ' $1') // Insert space before capital letters
      .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
      .trim();
  }
}
