import {
  Component,
  ContentChildren, EventEmitter, HostListener,
  Input,
  OnChanges,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef
} from '@angular/core';
import {BaseComponent} from "../base.component";
import {TabTemplateDirective} from "../tab/directive/tab-template.directive";

export interface TreeItem {
  key: any;
  value: any;
  parentKey: any;
  icon?: string;
  children?: TreeItem[];
  parent?: TreeItem;
}

export interface DropEvent {
  source: TreeItem;
  destination: TreeItem;
}

@Component({
  selector: 'd-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent extends BaseComponent implements OnChanges {

  @Input() items: any[] = [];
  @Input() draggable: boolean = false;
  @Input() verticalLines: boolean = true;
  @Input() expansion: '' | 'multiple' | 'single' = 'multiple';
  @Input() selection: '' | 'single' | 'multiple' | 'single-leaf' | 'multiple-leaf'  = '';
  @Input() fields = {
    key: 'id',
    parent: 'parentId',
    expanded: 'expanded',
    selected: 'selected',
  };
  @Input() icons = {
    collapse: 'far fa-angle-right',
    expand: 'far fa-angle-down',
    leaf: 'far fa-file',
  }

  @Output() onSelect = new EventEmitter<any>();
  @Output() onDrop = new EventEmitter<DropEvent>();

  @HostListener('window:dragend')
  onWindowMouseUp() {
    this.items.forEach(x => x.droppable = false);
  }

  itemTemplate?: TemplateRef<any>;
  prependTemplate?: TemplateRef<any>;
  appendTemplate?: TemplateRef<any>;

  @ContentChildren(TabTemplateDirective) set templates(value: QueryList<TabTemplateDirective>) {
    this.itemTemplate = value.find(x => x.includesName("item"))?.template;
    this.prependTemplate = value.find(x => x.includesName("prepend"))?.template;
    this.appendTemplate = value.find(x => x.includesName("append"))?.template;
  }

  dragItem?: TreeItem;
  roots: TreeItem[] = [];
  optimizedItems: TreeItem[] = [];

  override ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if('items' in changes) {
      this.optimizeItems();
    }
  }

  optimizeItems() {
    this.optimizedItems = [];
    this.items?.forEach(item => {
      this.optimizedItems.push({
        key: item[this.fields.key],
        value: item,
        parentKey: item[this.fields.parent],
      });
    });
    this.optimizedItems.forEach(x => {
      x.parent = this.optimizedItems.find(y => y.key == x.parentKey);
      x.children = this.optimizedItems.filter(y => y.parentKey == x.key);
    })
    this.render();
  }

  override render() {
    super.render();

    this.classes['vertical-lines'] = this.verticalLines;

    this.roots = this.optimizedItems.filter(x => !x.parent);
  }

  onItemClick(item: TreeItem, e: MouseEvent) {
    e.stopPropagation();
    this.toggleExpansion(item);
    this.toggleSelection(item);
  }

  onIconClick(item: TreeItem, e: MouseEvent) {
    e.stopPropagation();
    this.toggleExpansion(item);
  }

  toggleExpansion(item: TreeItem) {
    if(this.expansion) {
      const state = !item.value[this.fields.expanded];
      if(this.expansion.includes('single')) {
        const items = (item.parent?.children ?? this.roots);
        items.forEach(x => x.value[this.fields.expanded] = false);
      }
      item.value[this.fields.expanded] = state;
    }
  }

  toggleSelection(item: TreeItem) {
    if(this.selection) {
      const state = !item.value[this.fields.selected];
      const clear = () => {this.items.forEach(x => x[this.fields.selected] = false);}
      if(this.selection.includes('leaf')) {
        if(!item.children?.length) {
          if(this.selection.includes('single')) clear();
          item.value[this.fields.selected] = state;
        }
      } else {
        if(this.selection.includes('single')) clear();
        item.value[this.fields.selected] = state;
      }
    }
  }

  onDragOver(item: TreeItem, e: Event) {
    let tmpItem: any = item;
    while(tmpItem) {
      if(tmpItem == this.dragItem) return;
      tmpItem = tmpItem.parent;
    }
    e.preventDefault();
  }

  onItemDrag(item: TreeItem) {
    this.dragItem = item;
  }

  onItemDrop(item: TreeItem) {
    if(this.dragItem) {
      this.onDrop.emit({
        source: this.dragItem,
        destination: item
      });
    }
  }

  onDragEnter(item: TreeItem) {
    this.items.forEach(x => x.droppable = false);
    item.value.droppable = true;
  }
}
