import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myprofile'
})
export class MyprofilePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return null;
  }

}
