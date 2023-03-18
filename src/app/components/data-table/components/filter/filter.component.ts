import {
  Component, ComponentRef,
  ContentChildren, ElementRef, HostListener,
  Input,
  OnInit,
  QueryList,
  TemplateRef, ViewChild
} from "@angular/core";
import {TableService} from "../../services/table.service";
import {DevTemplateDirective} from "../../../../directives/template/dev-template.directive";
import {FormControl} from "@angular/forms";
import {KeyValue} from "@angular/common";
import {OverlayRef, OverlayService} from "../../../overlay/overlay.service";

type OperationKey = 'eq' | 'nq' | 'gt' | 'ge' | 'lt' | 'le' | 'sw' | 'ew' | 'in' | 'ni';

@Component({
  selector: 'dev-table-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class DataTableFilterComponent implements OnInit {
  @Input('field') field!: string;
  @Input('comparator') comparator?: (x: any) => boolean;
  @Input() overlay: boolean = true;
  @Input() template?: TemplateRef<any>;

  @ViewChild('overlayTpl') overlayTpl!: TemplateRef<any>;
  @ViewChild('filterIconEl') filterIconEl!: ElementRef<HTMLElement>;

  @ContentChildren(DevTemplateDirective) set templates(value: QueryList<DevTemplateDirective>) {
    const valueTemplate = value.find(x => !x.name || x.name == 'value')?.template;
    if(valueTemplate) this.template = valueTemplate;
  }

  @HostListener('window:keydown', ['$event'])
  onWindowKeydown(e: KeyboardEvent) {
    if(e.key == 'Escape') {
      this.overlayRef?.destroy();
    }
  }

  overlayRef?: OverlayRef;
  valueControl = new FormControl(null);
  operationControl = new FormControl<OperationKey>('in');
  operations: KeyValue<OperationKey, string>[] = [
    {key: 'eq', value: 'Equals'},
    {key: 'nq', value: 'Not equal'},
    {key: 'gt', value: 'Grater than'},
    {key: 'ge', value: 'Greater equal'},
    {key: 'lt', value: 'Less than'},
    {key: 'le', value: 'Less equal'},
    {key: 'sw', value: 'Start with'},
    {key: 'ew', value: 'End with'},
    {key: 'in', value: 'Include'},
    {key: 'ni', value: 'Not include'},
  ];

  constructor(private tableService: TableService, private overlayService: OverlayService) {
    this.tableService.filters.push(this);
  }

  ngOnInit(): void {
    this.valueControl.valueChanges.subscribe(e => {
      this.tableService.onFilterChange.next(this);
    })
  }

  openFilterOverlay(e: Event) {
    e.stopPropagation();
    if(this.overlayRef) return;
    this.overlayRef = this.overlayService.create(this.overlayTpl, {
      element: this.filterIconEl.nativeElement
    });
    this.overlayRef.onDestroy.subscribe(() => this.overlayRef = undefined);
  }
}
