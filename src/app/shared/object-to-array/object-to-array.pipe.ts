import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objectToArray'
})
export class ObjectToArrayPipe implements PipeTransform {

  transform(data: object): any[] {
    return Object.values(data).sort(item => item);
  }

}
