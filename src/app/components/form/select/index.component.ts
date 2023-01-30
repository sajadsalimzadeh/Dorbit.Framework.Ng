import {
  Component, ComponentRef,
  ContentChildren, ElementRef,
  HostListener, Injector,
  Input,
  OnChanges,
  QueryList,
  SimpleChanges, TemplateRef, ViewChild
} from "@angular/core";
import {TemplateDirective} from "../../../directives/template/index.directive";
import {AbstractFormControl, CreateControlValueAccessor} from "../abstract-form-control.directive";
import {OverlayService} from "../../overlay/overlay.service";
import {DomService} from "../../../services/dom.service";

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
    this.handleHoveredIndex(e);
  }

  @HostListener('click')
  onClick() {
    this.open()
  }

  optionTemplate?: TemplateDirective;

  @ContentChildren(TemplateDirective) set templates(value: QueryList<TemplateDirective>) {
    if (value) {
      this.optionTemplate = value.find(x => x.name == 'option');
    }
  }

  @ViewChild('itemsTpl') itemsTpl?: TemplateRef<any>;
  itemsComponentRef?: ComponentRef<any>;

  selectedItem: any;
  searchValue = '';

  hoveredIndex: number = 0;
  hoveredItem: any;

  renderedItems: any[] = [];

  constructor(injector: Injector,
              private domService: DomService,
              private elementRef: ElementRef,
              private overlayService: OverlayService) {
    super(injector);
  }

  private static getInfo(item: any, operation: string | Func) {
    if (!item) return '';
    if (!operation) return item;
    if (typeof operation === 'function') return operation(item);
    const split = operation.split('.');
    let tmp = item;
    for (let i = 0; i < split.length && tmp; i++) {
      tmp = tmp[split[i]];
    }
    return tmp;
  }

  override ngOnInit() {
    super.ngOnInit();
    this.search();
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

  handleHoveredIndex(e: KeyboardEvent, bySearchInput = false) {
    if (!this.itemsComponentRef && !bySearchInput) return;
    e.stopPropagation();

    if (e.key == 'Escape') {
      this.close();
      return;
    }

    if (['ArrowUp', 'ArrowDown'].includes(e.key)) {

      if (e.key == 'ArrowUp') this.hoveredIndex--;
      if (e.key == 'ArrowDown') this.hoveredIndex++;

      //hover item processing
      if (this.hoveredIndex < 0) this.hoveredIndex = 0;
      else if (this.hoveredIndex >= this.renderedItems.length) this.hoveredIndex = this.renderedItems.length - 1;

      if (this.hoveredIndex > -1 && this.hoveredIndex < this.renderedItems.length) {
        this.hoveredItem = this.renderedItems[this.hoveredIndex];
      } else this.hoveredItem = this.selectedItem;

      if (bySearchInput && !this.itemsComponentRef && this.hoveredItem) {
        this.select(this.hoveredItem);
      }
    } else if (e.key == 'Enter' && this.hoveredItem) {
      this.select(this.hoveredItem);
    } else {
      this.open();
    }
  }

  render() {
    //find selected item
    this.selectedItem = this.items.find(x => this.comparator(x, this.innerValue));
  }

  getValue(item: any): any {
    return SelectComponent.getInfo(item, this.valueField);
  }

  getText(item: any): string {
    return SelectComponent.getInfo(item, this.textField);
  }

  select(item: any, e?: MouseEvent) {
    e?.stopPropagation();
    this.innerValue = this.getValue(item);
    this._onChange(this.innerValue);
    this.render();
    this.searchValue = '';
    this.search();
    this.hoveredIndex = this.renderedItems.indexOf(this.selectedItem);
    this.close();
  }

  search() {
    this.renderedItems = this.items.filter(() => true);

    if (this.searchValue) {
      const value = this.searchValue.toString().toLowerCase();
      this.renderedItems = this.renderedItems.filter(x => {
        const text = this.getText(x);
        if (text) return text.toString().toLowerCase().includes(value)
        return false;
      })
    }
  }

  private open() {
    if (this.itemsTpl && this.elementRef.nativeElement && !this.itemsComponentRef) {
      this.itemsComponentRef = this.overlayService.createByTemplate(this.elementRef.nativeElement, this.itemsTpl)
      this.itemsComponentRef.onDestroy(() => {
        this.itemsComponentRef = undefined;
      })
    }
  }

  private close() {
    this.itemsComponentRef?.destroy();
  }
}
