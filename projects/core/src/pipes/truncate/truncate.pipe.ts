import {NgModule, Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'truncate'
})

export class TruncatePipe implements PipeTransform {
  transform(value: string, length: number): string {
    if(!value) return '';
    return (value.length > length ? value.substring(0, length) + '...' : value);
  }
}

@NgModule({
  declarations:[TruncatePipe],
  exports: [TruncatePipe]
})
export class TruncateModule {

}
