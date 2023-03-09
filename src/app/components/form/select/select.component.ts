import {
  Component, ComponentRef,
  ContentChildren, ElementRef, HostBinding,
  HostListener, Injector,
  Input,
  OnChanges,
  QueryList,
  SimpleChanges, TemplateRef, ViewChild
} from "@angular/core";
import {DevTemplateDirective} from "../../../directives/template/dev-template.directive";
import {AbstractFormControl, createControlValueAccessor} from "../form-control.directive";
import {OverlayRef, OverlayService} from "../../overlay/overlay.service";
import {DomService} from "../../../services/dom.service";

type Func = (item: any) => any;

@Component({
  selector: 'dev-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss', '../control-box.scss'],
  providers: [createControlValueAccessor(SelectComponent)]
})
export class SelectComponent extends AbstractFormControl<any> {
  @Input() items: any[] = [];
  @Input() valueField: string | Func = 'value';
  @Input() textField: string | Func = 'text';
  @Input() comparator = (item: any, value: any) => this.getValue(item) == value;

  @HostBinding('class.open') get isOpen() {
    return !!this.overlayRef;
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    this.overlayRef?.destroy();
    this.handleHoveredIndex(e);
  }

  override onClick(e: MouseEvent) {
    e.stopPropagation();
    this.open();
    super.onClick(e);
  }

  override onFocus(e: FocusEvent) {
    super.onFocus(e);
    this.open();
  }

  optionTemplate?: DevTemplateDirective;

  @ContentChildren(DevTemplateDirective) set templates(value: QueryList<DevTemplateDirective>) {
    if (value) {
      this.optionTemplate = value.find(x => x.name == 'option');
    }
  }

  @ViewChild('itemsTpl') itemsTpl?: TemplateRef<any>;
  overlayRef?: OverlayRef;

  selectedItem: any;
  searchValue = '';

  hoveredIndex: number = 0;
  hoveredItem: any;

  renderedItems: any[] = [];

  constructor(injector: Injector,
              private domService: DomService,
              private overlayService: OverlayService) {
    super(injector);
  }

  private static getInfo(item: any, operation: string | Func) {
    if (!item) return '';
    if (!operation) return item;
    if (typeof operation === 'function') return operation(item);
    return item[operation];
  }

  override ngOnInit() {
    super.ngOnInit();
    this.search();
  }

  override ngOnChanges(changes: SimpleChanges): void {
    if (changes['items'] && this.items?.length > 0) {
      switch (typeof this.items[0]) {
        case 'string':
        case 'boolean':
        case 'number':
          this.textField = '';
          this.valueField = '';
          break;
      }
    }
  }

  handleHoveredIndex(e: KeyboardEvent, bySearchInput = false) {
    if (!this.overlayRef && !bySearchInput) return;
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

      if (bySearchInput && !this.overlayRef && this.hoveredItem) {
        this.select(this.hoveredItem);
      }
    } else if (e.key == 'Enter' && this.hoveredItem) {
      this.select(this.hoveredItem);
    } else {
      this.open();
    }
  }

  override render() {
    super.render();
    //find selected item
    this.selectedItem = this.items.find(x => this.comparator(x, this.formControl.value));
  }

  getValue(item: any): any {
    return SelectComponent.getInfo(item, this.valueField);
  }

  getText(item: any): string {
    return SelectComponent.getInfo(item, this.textField);
  }

  select(item: any, e?: MouseEvent) {
    e?.stopPropagation();
    const value = this.getValue(item);
    if (this._onChange) this._onChange(value);
    this.formControl.setValue(value);
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
    if (this.itemsTpl && this.elementRef.nativeElement && !this.overlayRef) {
      this.overlayRef = this.overlayService.createByTemplate(this.elementRef.nativeElement, this.itemsTpl)
      this.overlayRef.onDestroy.subscribe(() => this.overlayRef = undefined);
    }
  }

  private close() {
    this.overlayRef?.destroy();
  }
}
