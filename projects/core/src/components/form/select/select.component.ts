import {
  Component,
  ContentChildren, ElementRef, EventEmitter, HostBinding,
  HostListener, Injector,
  Input, Output,
  QueryList,
  SimpleChanges, TemplateRef, ViewChild
} from "@angular/core";
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
  @Input() clearable: boolean = true;
  @Input() valueField: string | Func = 'value';
  @Input() textField: string | Func = 'text';
  @Input() searchable: boolean = true;
  @Input() searchPlaceHolder: string = 'Search ....';
  @Input() isLazySearch: boolean = false;
  @Input() loading: boolean = false;
  @Input() comparator = (item: any, value: any) => this.getValue(item) == value;

  @Output() onSearch = new EventEmitter<string | null>();

  @HostBinding('class.open') get isOpen() {
    return !!this.overlayRef;
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    this.handleHoveredIndex(e);
  }

  @ViewChild('itemsTpl') itemsTpl?: TemplateRef<any>;
  @ViewChild(InputComponent) inputComponent?: InputComponent;

  @ViewChild('itemsContainerEl') itemsContainerEl?: ElementRef<HTMLUListElement>;

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

  overlayRef?: OverlayRef;

  searchFormControl = new FormControl('');

  hoveredIndex: number = 0;
  hoveredItem: any;

  renderedItems: any[] = [];
  selectedItems: any[] = [];

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
    this.updateItemsSelectedState();
    this.search();
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
      this.formControl.setValue(this.getValue(item));
      this.close();
    } else {
      const selectedItems = (Array.isArray(this.formControl.value) ? this.formControl.value : []) as T[];
      const value = this.getValue(item);
      const findIndex = selectedItems.findIndex(x => x == value);
      if (findIndex > -1) selectedItems.splice(findIndex, 1);
      else selectedItems.push(value);
      this.formControl.setValue([...selectedItems]);
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
  }

  clear() {
    this.formControl.reset();
  }

  private open() {
    if (this.itemsTpl && this.elementRef.nativeElement && !this.overlayRef) {
      this.overlayRef = this.overlayService.create({
        autoClose: false,
        template: this.itemsTpl,
        ref: this.elementRef.nativeElement,
      })
      this.overlayRef.onDestroy.subscribe(() => this.overlayRef = undefined);
      setTimeout(() => {
        this.inputComponent?.inputEl?.nativeElement.focus();
      }, 10);

      setTimeout(() => {
        const containerEl = this.itemsContainerEl?.nativeElement;
        if (containerEl) {
          const selectedItemEl = containerEl.querySelector('.selected') as HTMLLIElement;
          console.log(selectedItemEl?.offsetTop)
          if (selectedItemEl) {
            containerEl.scrollTop = (selectedItemEl.offsetTop - (containerEl.offsetHeight / 2));
          }
        }
      }, 100);
    }
  }

  private close() {
    this.overlayRef?.destroy();
  }
}
