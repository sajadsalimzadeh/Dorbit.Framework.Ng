import {Component, ContentChildren, EventEmitter, HostListener, Input, OnChanges, Output, QueryList, SimpleChanges, TemplateRef} from '@angular/core';
import {TemplateDirective} from "../../directives/template/template.directive";
import {Colors} from "../../types";
import {AbstractComponent} from "../abstract.component";
import {CommonModule} from "@angular/common";

export interface TreeItem {
  key: any;
  value: any;
  parentKey: any;
  selected?: boolean;
  expanded?: boolean;
  icon?: string;
  children?: TreeItem[];
  parent?: TreeItem;
}

export interface DropEvent {
  source: TreeItem;
  destination: TreeItem;
}

@Component({
    standalone: true,
    imports: [CommonModule],
    selector: 'd-tree',
    templateUrl: './tree.component.html',
    styleUrls: ['./tree.component.scss'],
})
export class TreeComponent extends AbstractComponent implements OnChanges {

  @Input() items: any[] = [];
  @Input() draggable: boolean = false;
  @Input() verticalLines: boolean = true;
  @Input() expandKeys: any[] = [];
  @Input() selectKeys: any[] = [];
  @Input() expansion: '' | 'multiple' | 'single' = 'multiple';
  @Input() selection: '' | 'single' | 'multiple' | 'single-leaf' | 'multiple-leaf' = '';
  @Input() fields = {
    key: 'id',
    parent: 'parentId',
  };
  @Input() icons = {
    collapse: 'icons-core-angle-right',
    expand: 'icons-core-angle-down',
    leaf: 'icons-core-file',
  }

  override color: Colors = 'primary';

  @Output() onSelect = new EventEmitter<any>();
  @Output() onDrop = new EventEmitter<DropEvent>();

  @HostListener('window:dragend')
  onWindowMouseUp() {
    this.items.forEach(x => x.droppable = false);
  }

  itemTemplate?: TemplateRef<any>;
  prependTemplate?: TemplateRef<any>;
  appendTemplate?: TemplateRef<any>;

  @ContentChildren(TemplateDirective) set templates(value: QueryList<TemplateDirective>) {
    this.itemTemplate = value.find(x => x.includesName("item", true))?.template;
    this.prependTemplate = value.find(x => x.includesName("prepend"))?.template;
    this.appendTemplate = value.find(x => x.includesName("append"))?.template;
  }

  dragItem?: TreeItem;
  roots: TreeItem[] = [];
  optimizedItems: TreeItem[] = [];

  override ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if ('items' in changes) {
      this.optimizeItems();
    }
  }

  optimizeItems() {
    this.optimizedItems = [];
    const items = (this.items ?? []);
    items.forEach(item => {
      this.optimizedItems.push({
        key: item[this.fields.key],
        value: item,
        icon: item.icon,
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

    this.setClass('vertical-lines', this.verticalLines);

    this.optimizedItems.forEach(x => {
      x.expanded = this.expandKeys.includes(x.key);
      x.selected = this.selectKeys.includes(x.key);
    })
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
    if (this.expansion) {
      const index = this.expandKeys.indexOf(item.key)
      if(index > -1) this.expandKeys.splice(index, 1);
      else {

        if (this.expansion.includes('single')) {
          const items = (item.parent?.children ?? this.roots);
          items.forEach(x => {
            const index = this.expandKeys.indexOf(x.key);
            if(index > -1) this.expandKeys.splice(index, 1);
            x.expanded = false
          });
        }

        this.expandKeys.push(item.key);
      }
      this.render();
    }
  }

  toggleSelection(item: TreeItem) {
    if (this.selection) {
      const state = !item.selected;
      const clear = () => {
        this.selectKeys.splice(0, this.selectKeys.length);
      }

      if (this.selection.includes('leaf')) {
        if (!item.children?.length) {
          if (this.selection.includes('single')) clear();
          if(state) this.selectKeys.push(item.key);
        }
      } else {
        if (this.selection.includes('single')) clear();
        if(state) this.selectKeys.push(item.key);
      }
      this.render();
    }
  }

  onDragOver(item: TreeItem, e: Event) {
    let tmpItem: any = item;
    while (tmpItem) {
      if (tmpItem == this.dragItem) return;
      tmpItem = tmpItem.parent;
    }
    e.preventDefault();
  }

  onItemDrag(item: TreeItem) {
    this.dragItem = item;
  }

  onItemDrop(item: TreeItem) {
    if (this.dragItem) {
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
