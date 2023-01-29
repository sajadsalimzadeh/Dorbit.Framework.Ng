import {
  Component,
  ContentChildren, ElementRef, forwardRef, HostBinding,
  HostListener, Injector,
  Input,
  OnChanges, OnInit,
  Optional,
  QueryList,
  SimpleChanges, SkipSelf
} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, NgModel} from "@angular/forms";
import {TemplateDirective} from "../../../directives/template/index.directive";
import {AbstractFormControl, CreateControlValueAccessor} from "../abstract-form-control.directive";

type Func = (item: any) => any;

@Component({
  selector: 'dev-select',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  providers: [CreateControlValueAccessor(SelectComponent)]
})
export class SelectComponent extends AbstractFormControl<any> implements OnChanges {
  @Input() items: any[] = [];
  @Input() valueField: string | Func = 'value';
  @Input() textField: string | Func = 'text';
  @Input() placeholder: string = 'choose one of theme';
  @Input() comparator = (item: any, value: any) => this.getValue(item) == value;

  @HostListener('window:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case 'ArrowUp':
        this.hoveredIndex--;
        this.render();
        break;
      case 'ArrowDown':
        this.hoveredIndex++;
        this.render();
        break;
    }
  }

  @HostListener('window:click', ['$event'])
  onWindowClick(e: MouseEvent) {
    this.isOpen = false;
  }

  @HostListener('click', ['$event'])
  onClick(e: MouseEvent) {
    this.isOpen = true;
    e.stopPropagation();
  }

  optionTemplate?: TemplateDirective;

  @ContentChildren(TemplateDirective) set templates(value: QueryList<TemplateDirective>) {
    if (value) {
      this.optionTemplate = value.find(x => x.name == 'option');
    }
  }

  @HostBinding('class.open')
  isOpen = false;
  selectedItem: any;
  searchValue = '';

  hoveredIndex: number = 0;
  hoveredItem: any;

  constructor(injector: Injector) {
    super(injector);
  }

  private static getInfo(item: any, operation: string | Func) {
    if(!item) return '';
    if (!operation) return item;
    if (typeof operation === 'function') return operation(item);
    const split = operation.split('.');
    let tmp = item;
    for (let i = 0; i < split.length && tmp; i++) {
      tmp = tmp[split[i]];
    }
    return tmp;
  }

  render() {
    //find selected item
    this.selectedItem = this.items.find(x => this.comparator(x, this.innerValue));
    this.hoveredIndex = this.items.indexOf(this.selectedItem);

    //hover item processing
    if (this.hoveredIndex < 0) this.hoveredIndex = 0;
    else if (this.hoveredIndex >= this.items.length) this.hoveredIndex = this.items.length - 1;

    if (this.hoveredIndex > -1 && this.hoveredIndex < this.items.length) {
      this.hoveredItem = this.items[this.hoveredIndex];
    } else this.hoveredItem = null;
  }

  getValue(item: any) {
    return SelectComponent.getInfo(item, this.valueField);
  }

  getText(item: any) {
    return SelectComponent.getInfo(item, this.textField);
  }

  select(item: any, e: MouseEvent) {
    e.stopPropagation();
    this.isOpen = false;
    this.innerValue = this.getValue(item);
    this.render();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items'] && this.items?.length > 0) {
      switch (typeof this.items[0]) {
        case 'string':
        case 'boolean':
        case 'number':
          this.textField = '';
          this.valueField = '';
          break;
        default:
          this.textField = 'text';
          this.valueField = 'value';
      }
    }
  }


}
