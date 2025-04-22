import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderByFecha'
})
export class OrderByFechaPipe implements PipeTransform {
  transform(value: any[]): any[] {
    return value.sort((a, b) => {
      const dateA = new Date(a.fecha);
      const dateB = new Date(b.fecha);
      return dateA.getTime() - dateB.getTime();
    });
  }
}