import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  Injector,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from "@angular/core";
import {Colors, Sizes} from "../types";


@Directive()
export abstract class BaseComponent implements OnInit, OnChanges {
  @Input() size: Sizes = 'md';
  @Input() color: Colors = 'primary';

  @HostBinding('class')
  classes: any = {};

  protected elementRef: ElementRef<HTMLElement>;

  constructor(protected injector: Injector) {
    this.elementRef = injector.get(ElementRef);
  }

  ngOnInit() {
    this.render();
  }
  ngOnChanges(changes: SimpleChanges) {
    this.render();
  }

  render() {
    this.classes = {};
    this.classes[this.size] = true;
    this.classes[this.color] = true;

    this.elementRef.nativeElement.style.setProperty('--color-component', `var(--color-${this.color})`);
    this.elementRef.nativeElement.style.setProperty('--color-component-rgb', `var(--color-${this.color}-rgb)`);
  }
}
