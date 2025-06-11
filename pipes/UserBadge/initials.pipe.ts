import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initials',
  standalone: true
})
export class InitialsPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    const words = value.split(' ');
    let initials = words[0][0].toUpperCase(); // First letter of first word
    if (words.length > 1) {
      initials += words[1][0].toUpperCase(); // First letter of second word (if exists)
    } else if (words[0].length > 1) {
      initials += words[0][1].toUpperCase(); // Second letter of the first word
    }
    return initials;
  }

}
