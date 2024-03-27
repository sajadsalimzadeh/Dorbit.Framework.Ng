import {Directive, ElementRef, HostListener, Input, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

const intRegex = /^[0-9]$/;

export type KeyFilters = 'p-int' | 'int' | 'n-int' | 'p-num' | 'num' | 'n-num' | 'hex' | 'email' | 'alpha' | 'alphnum' | 'persian' | string;

@Directive({
  selector: '[dKeyFilter]'
})
export class DevKeyFilterDirective {
  @Input('dKeyFilter') dKeyFilter?: KeyFilters;

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    if (!this.dKeyFilter) return;
    const target = e.target;
    if (!(target instanceof HTMLInputElement)) return;
    if (e.key.length != 1) return;
    const isSelectAll = (target.selectionStart == 0 && target.selectionEnd == target.value.length);

    switch (this.dKeyFilter) {
      case 'p-int':
        if (target.value.length == 0 && /^\+$/.test(e.key)) {
          return;
        } else if (!intRegex.test(e.key)) {
          e.preventDefault();
        }
        break;
      case 'int':
        if (target.value.length == 0 && /^[+\-]$/.test(e.key)) {
          return;
        } else if (!intRegex.test(e.key)) {
          e.preventDefault();
        }
        break;
      case 'n-int':
        if (target.value.length == 0) {
          if (!/^-$/.test(e.key)) {
            e.preventDefault();
          }
        } else if (!intRegex.test(e.key)) {
          e.preventDefault();
        }
        break;
      case 'p-num':
        if (target.value.length == 0 && /^\+$/.test(e.key)) {
          return;
        } else if (target.value.includes('.')) {
          if (!intRegex.test(e.key)) {
            e.preventDefault();
          }
        } else if (!/^\.$/.test(e.key) && !intRegex.test(e.key)) {
          e.preventDefault();
        }
        break;
      case 'num':
        if ((target.value.length == 0 || isSelectAll) && /^[+\-]$/.test(e.key)) {
          return;
        } else if (e.key == '.') {
          if(target.value.includes('.')) {
            e.preventDefault();
          }
          return;
        }
        if (!intRegex.test(e.key)) {
          e.preventDefault();
        }
        break;
      case 'n-num':
        if (target.value.length == 0) {
          if (!/^-$/.test(e.key)) {
            e.preventDefault();
          }
        } else if (target.value.includes('.')) {
          if (!intRegex.test(e.key)) {
            e.preventDefault();
          }
        } else if (!/^\.$/.test(e.key) && !intRegex.test(e.key)) {
          e.preventDefault();
        }
        break;
      case 'hex':
        if (!e.key.match(/^[0-9a-hA-H]$/)) {
          e.preventDefault();
        }
        break;
      case 'email':
        if (target.value.includes('@') && e.key == '@') e.preventDefault();
        else if (!e.key.match(/^[0-9a-zA-Z.]$/)) {
          e.preventDefault();
        }
        break;
      case 'alpha':
        if (!e.key.match(/^[a-zA-Z\s]$/)) {
          e.preventDefault();
        }
        break;
      case 'alphanum':
        if (!e.key.match(/^[a-zA-Z0-9\s]$/)) {
          e.preventDefault();
        }
        break;
      case 'persian':
        if (!e.key.match(/^[\u0600-\u06FF\s]+$/)) {
          e.preventDefault();
        }
        break;
    }
  }
}

@NgModule({
  imports: [CommonModule],
  declarations: [DevKeyFilterDirective],
  exports: [DevKeyFilterDirective]
})
export class KeyFilterModule {
}
