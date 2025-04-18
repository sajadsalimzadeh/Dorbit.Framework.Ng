import {Directive, ElementRef, HostListener, Input, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

@Directive({
    standalone: true,
    selector: '[dHotKey]',
})
export class HotKeyDirective {
  @Input({required: true, alias: 'dHotKey'}) key!: string;

  @HostListener('window:keydown', ['$event'])
  onWindowKeyDown(e: KeyboardEvent) {
    if (e.key == this.key) {
      this.elementRef.nativeElement.click();
    }
  }


  constructor(private elementRef: ElementRef) {
  }
}
