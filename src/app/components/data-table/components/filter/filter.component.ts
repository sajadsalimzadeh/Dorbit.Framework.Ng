import {
  AfterViewInit,
  Component, ComponentRef,
  ContentChildren, ElementRef,
  Input,
  OnChanges,
  OnInit,
  QueryList,
  SimpleChanges, TemplateRef, ViewChild
} from "@angular/core";
import {TableService} from "../../services/table.service";
import {TemplateDirective} from "../../../../directives/template/template.directive";
import {FormControl} from "@angular/forms";
import {KeyValue} from "@angular/common";
import {OverlayService} from "../../../overlay/overlay.service";

type OperationKey = 'eq' | 'nq' | 'gt' | 'ge' | 'lt' | 'le' | 'in' | 'sw' | 'ew' | 'in' | 'ni';

@Component({
  selector: 'dev-table-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class DataTableFilterComponent implements OnInit, OnChanges, AfterViewInit {
  @Input('name') name!: string;
  @Input('comparator') comparator?: (x: any) => boolean;
  @Input() overlay: boolean = true;
  @Input() template?: TemplateRef<any>;

  @ViewChild('overlayTpl') overlayTpl!: TemplateRef<any>;
  @ViewChild('filterIconEl') filterIconEl!: ElementRef<HTMLElement>;

  @ContentChildren(TemplateDirective) set templates(value: QueryList<TemplateDirective>) {
    const valueTemplate = value.find(x => !x.name || x.name == 'value')?.template;
    if(valueTemplate) this.template = valueTemplate;
  }

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
  overlayRef?: ComponentRef<any>;

  constructor(private tableService: TableService, private overlayService: OverlayService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['name']) {
      this.tableService.filters[this.name] = this;
    }
  }

  ngOnInit(): void {
    this.valueControl.valueChanges.subscribe(e => {
      this.tableService.onFilterChange.next(this);
    })
  }

  ngAfterViewInit(): void {
  }

  openFilterOverlay(e: Event) {
    e.stopPropagation();
    if(this.overlayRef) return;
    this.overlayRef = this.overlayService.createByTemplate(this.filterIconEl.nativeElement, this.overlayTpl);
    this.overlayRef.onDestroy(() => this.overlayRef = undefined);
  }
}
