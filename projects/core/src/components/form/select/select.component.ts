import {
  Component,
  ContentChildren, HostBinding,
  HostListener, Injector,
  Input,
  QueryList,
  SimpleChanges, TemplateRef, ViewChild
} from "@angular/core";
import {TemplateDirective} from "../../../directives/template/template.directive";
import {AbstractFormControl, createControlValueAccessor} from "../form-control.directive";
import {OverlayRef, OverlayService} from "../../overlay/overlay.service";
import {InputComponent} from "../input/input.component";
import {FormControl} from "@angular/forms";

type Func = (item: any) => any;

@Component({
  selector: 'd-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss', '../control.scss'],
  providers: [createControlValueAccessor(SelectComponent)]
})
export class SelectComponent extends AbstractFormControl<any | any[]> {
  @Input() items: any[] = [];
  @Input() mode: 'single' | 'multiple' = 'single';
  @Input() valueField: string | Func = 'value';
  @Input() textField: string | Func = 'text';
  @Input() searchPlaceHolder: string = 'Search ....';
  @Input() comparator = (item: any, value: any) => this.getValue(item) == value;

  @HostBinding('class.open') get isOpen() {
    return !!this.overlayRef;
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    this.handleHoveredIndex(e);
  }

  @ViewChild('itemsTpl') itemsTpl?: TemplateRef<any>;
  @ViewChild(InputComponent) inputComponent?: InputComponent;

  optionTemplate?: TemplateDirective;

  @ContentChildren(TemplateDirective) set templates(value: QueryList<TemplateDirective>) {
    if (value) {
      this.optionTemplate = value.find(x => x.includesName('option'));
    }
  }

  override onClick(e: MouseEvent) {
    e.stopPropagation();
    this.open();
    super.onClick(e);
  }

  override onFocus(e: FocusEvent) {
    e.preventDefault();
    this.open();
    super.onFocus(e);
  }

  get selectedItems() {
    return this.items.filter(x => x.selected);
  }

  overlayRef?: OverlayRef;

  searchFormControl = new FormControl('');

  hoveredIndex: number = 0;
  hoveredItem: any;

  renderedItems: any[] = [];

  constructor(injector: Injector, private overlayService: OverlayService) {
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
    this.subscription.add(this.searchFormControl.valueChanges.subscribe(() => {
      this.search();
    }));
    this.search();
  }

  override ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']) {
      this.items.filter(x => typeof x !== 'object').forEach((x, i) => {
        this.items[i] = {text: x, value: x};
      });
    }
    super.ngOnChanges(changes);
  }

  private getSelectedItems(): any[] {
    return this.items.filter(x => x.selected);
  }

  private handleHoveredIndex(e: KeyboardEvent, bySearchInput = false) {
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
      } else this.hoveredItem = this.items.find(x => x.selected);

      if (bySearchInput && !this.overlayRef && this.hoveredItem) {
        this.select(this.hoveredItem);
      }
    } else if (e.key == 'Enter' && this.hoveredItem) {
      this.select(this.hoveredItem);
    } else {
      this.open();
    }
  }

  private updateFormControlValue() {
    const selectedItems = this.getSelectedItems();
    if (this.mode === 'single') {
      if (selectedItems.length == 0) {
        this.formControl.setValue(null);
      } else {
        this.formControl.setValue(this.getValue(selectedItems[0]));
      }
    } else {
      if (selectedItems.length == 0) {
        this.formControl.setValue(null);
      } else {
        this.formControl.setValue(selectedItems.map(x => this.getValue(x)));
      }
    }
    this.render();
  }

  private updateItemsSelectedState() {
    const values = this.formControl.value;
    if(Array.isArray(values)) {
      this.items.forEach(x => x.selected = values.findIndex(y => this.comparator(x, y)) > -1);
    } else {
      this.items.forEach(x => x.selected = this.comparator(x, values));
    }
  }

  override render() {
    this.updateItemsSelectedState();
    super.render();
  }

  getValue(item: any): any {
    return SelectComponent.getInfo(item, this.valueField);
  }

  getText(item: any): string {
    return SelectComponent.getInfo(item, this.textField);
  }

  select(item: any, e?: MouseEvent) {
    e?.stopPropagation();

    if (this.mode == 'single') {
      this.items.forEach(x => x.selected = false);
      this.close();
    }

    item.selected = !item.selected;
    this.updateFormControlValue();
    this.hoveredIndex = this.renderedItems.findIndex(x => x.selected);
  }

  search() {
    this.renderedItems = this.items.filter(() => true);

    if (this.searchFormControl.value) {
      const value = this.searchFormControl.value.toString().toLowerCase();
      this.renderedItems = this.renderedItems.filter(x => {
        const text = this.getText(x);
        if (text) return text.toString().toLowerCase().includes(value)
        return false;
      })
    }
  }

  private open() {
    if (this.itemsTpl && this.elementRef.nativeElement && !this.overlayRef) {
      this.overlayRef = this.overlayService.create({
        template: this.itemsTpl,
        targetElement: this.elementRef.nativeElement,
      })
      this.overlayRef.onDestroy.subscribe(() => this.overlayRef = undefined);
      setTimeout(() => {
        this.inputComponent?.inputEl?.nativeElement.focus();
      }, 10);
    }
  }

  private close() {
    this.overlayRef?.destroy();
  }
}
