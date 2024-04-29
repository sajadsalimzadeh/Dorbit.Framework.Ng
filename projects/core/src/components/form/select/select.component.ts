import {Component, ContentChildren, ElementRef, EventEmitter, HostBinding, HostListener, Injector, Input, Output, QueryList, SimpleChanges, TemplateRef, ViewChild} from "@angular/core";
import {TemplateDirective} from "../../template/template.directive";
import {AbstractFormControl, createControlValueAccessor} from "../form-control.directive";
import {OverlayRef, OverlayService} from "../../overlay/overlay.service";
import {InputComponent} from "../input/input.component";
import {FormControl} from "@angular/forms";

type Func = (item: any) => any;

@Component({
  selector: 'd-select',
  templateUrl: './select.component.html',
  styleUrls: ['../control.scss', './select.component.scss'],
  providers: [createControlValueAccessor(SelectComponent)]
})
export class SelectComponent<T> extends AbstractFormControl<T | T[]> {
  @Input() items: any[] = [];
  @Input() mode: 'single' | 'multiple' = 'single';
  @Input() align: '' | 'left' | 'right' | 'center' = '';
  @Input() clearable: boolean = true;
  @Input() valueField: string | Func = 'value';
  @Input() textField: string | Func = 'text';
  @Input() searchPlaceHolder: string = 'Search ....';
  @Input() isLazySearch: boolean = false;
  @Input() loading: boolean = false;
  @Input() searchable?: boolean;
  @Input() icon?: string;
  @Input() comparator = (item: any, value: any) => this.getValue(item) == value;

  @Output() onSearch = new EventEmitter<string | null>();
  @Output() onAdd = new EventEmitter<any>;

  @ViewChild('itemsTpl') itemsTpl?: TemplateRef<any>;
  @ViewChild(InputComponent) inputComponent?: InputComponent;

  @ViewChild('itemsContainerEl') itemsContainerEl?: ElementRef<HTMLUListElement>;

  @HostBinding('class.open') get isOpen() {
    return !!this.overlayRef;
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    this.handleHoveredIndex(e);
  }

  @HostListener('window:click')
  onWindowClick() {
    this.close();
  }

  optionTemplate?: TemplateRef<any>;

  @ContentChildren(TemplateDirective) set templates(value: QueryList<TemplateDirective>) {
    if (value) {
      this.optionTemplate = value.find(x => x.includesName('option', true))?.template;
    }
  }

  override onClick(e: MouseEvent) {
    e.stopPropagation();
    super.onClick(e);
    if(this.focused) this.open();
  }

  override onFocus(e: FocusEvent) {
    e.stopPropagation();
    super.onFocus(e);
    this.open();
  }

  override onBlur(e: FocusEvent) {
    super.onBlur(e);

    setTimeout(() => {
      if (!this.focused) {
        this.close();
      }
    }, 1000)
  }

  overlayRef?: OverlayRef;
  searchFormControl = new FormControl('');
  hoveredIndex: number = -1;
  hoveredItem: any;
  renderedItems: any[] = [];
  selectedItems: any[] = [];

  constructor(injector: Injector, private overlayService: OverlayService) {
    super(injector);
  }

  private getInfo(item: any, operation: string | Func) {
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

    this.subscription.add(this.searchFormControl.valueChanges.subscribe(e => {
      this.onSearch.emit(e);
      this.updateItemsSelectedState();
    }));
  }

  override ngOnChanges(changes: SimpleChanges): void {
    if ('items' in changes) {
      if (this.items) {
        this.items.filter(x => typeof x !== 'object').forEach((x, i) => {
          this.items[i] = {text: x, value: x};
        });
      } else {
        this.items = [];
      }
      this.updateItemsSelectedState();
    }
    super.ngOnChanges(changes);
  }

  private handleHoveredIndex(e: KeyboardEvent) {
    if (!this.focused) return;
    e.stopPropagation();

    if (e.key == 'Escape') return this.close();

    if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
      if (!this.overlayRef) this.open();

      if (e.key == 'ArrowUp') this.hoveredIndex--;
      if (e.key == 'ArrowDown') this.hoveredIndex++;

      //hover item processing
      if (this.hoveredIndex < 0) this.hoveredIndex = 0;
      else if (this.hoveredIndex >= this.renderedItems.length) this.hoveredIndex = this.renderedItems.length - 1;

      if (this.hoveredIndex > -1 && this.hoveredIndex < this.renderedItems.length) {
        this.hoveredItem = this.renderedItems[this.hoveredIndex];
      } else this.hoveredItem = this.items.find(x => x.selected);

      if (!this.overlayRef && this.hoveredItem) {
        this.select(this.hoveredItem);
      }
    } else if (e.key == 'Enter') {
      if (this.overlayRef) {
        if (this.hoveredItem) this.select(this.hoveredItem);
        else if (this.renderedItems.length == 1) this.select(this.renderedItems[0]);
        else this.onAdd.emit();
      } else {
        let el = this.elementRef.nativeElement;
        while (el?.tagName) {
          if (el.tagName.toLowerCase() == 'form') {
            const btn = el.querySelector('button[type="submit"]') as HTMLButtonElement;
            btn?.click();
            break;
          }
          el = el.parentNode as HTMLElement;
        }
      }
    }
  }

  private updateItemsSelectedState() {
    if (!this.formControl) return;
    const values = this.formControl.value;
    if (Array.isArray(values)) {
      this.selectedItems = this.items.filter(x => values.findIndex(y => this.comparator(x, y)) > -1);
    } else {
      this.selectedItems = this.items.filter(x => x.selected = this.comparator(x, values));
    }
  }

  override render() {
    super.render();
    this.items.forEach(x => x.selected = false);
    this.selectedItems.forEach(x => x.selected = true);

    this.updateItemsSelectedState();
    this.search();
  }

  getValue(item: any): any {
    return this.getInfo(item, this.valueField);
  }

  getText(item: any): string {
    return this.getInfo(item, this.textField);
  }

  select(item: any, e?: MouseEvent) {
    e?.stopPropagation();

    if (this.mode == 'single') {
      this.formControl.setValue(this.getValue(item));
      this.elementRef.nativeElement.focus();
      this.close();
    } else {
      const selectedItems = (Array.isArray(this.formControl.value) ? this.formControl.value : []) as T[];
      const value = this.getValue(item);
      const index = selectedItems.findIndex(x => x == value);
      if (index > -1) selectedItems.splice(index, 1);
      else selectedItems.push(value);
      this.formControl.setValue([...selectedItems]);
      this.updateItemsSelectedState();
    }
    this.render();
  }

  search() {
    this.renderedItems = this.items.filter(() => true);
    if (!this.isLazySearch && this.searchFormControl.value) {
      const value = this.searchFormControl.value.toString().toLowerCase();
      this.renderedItems = this.renderedItems.filter(x => {
        const text = this.getText(x);
        if (text) return text.toString().toLowerCase().includes(value)
        return false;
      })
    }
    this.renderedItems = this.renderedItems.slice(0, 30);
  }

  clear() {
    this.formControl.reset();
    this.close();
  }

  private open() {
    if (this.itemsTpl && this.elementRef.nativeElement && !this.overlayRef && this.formControl.enabled) {
      this.overlayRef = this.overlayService.create({
        autoClose: false,
        template: this.itemsTpl,
        ref: this.elementRef.nativeElement,
      })
      this.overlayRef.onDestroy.subscribe(() => this.overlayRef = undefined);
      setTimeout(() => {
        if (this.renderedItems.length > 10) {
          this.inputComponent?.inputEl?.nativeElement.focus();
        }
      }, 10);

      setTimeout(() => {
        const containerEl = this.itemsContainerEl?.nativeElement;
        if (containerEl) {
          const selectedItemEl = containerEl.querySelector('.selected') as HTMLLIElement;
          if (selectedItemEl) {
            containerEl.scrollTop = (selectedItemEl.offsetTop - (containerEl.offsetHeight / 2));
          }
        }
      }, 100);
    }
  }

  private close() {
    if (this.overlayRef) {
      this.overlayRef.destroy();
    }
  }
}
