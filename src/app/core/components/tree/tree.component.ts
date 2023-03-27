import {Component, ContentChildren, Input, OnChanges, QueryList, SimpleChanges, TemplateRef} from '@angular/core';
import {BaseComponent} from "../base.component";
import {TemplateDirective} from "../tab/directive/template.directive";
import {filter} from "rxjs";

export interface TreeItem {
  key: any;
  value: any;
  parentKey: any;
  icon?: string;
  children?: TreeItem[];
  parent?: TreeItem;
}

@Component({
  selector: 'd-tree',
  templateUrl: 'tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent extends BaseComponent implements OnChanges {

  @Input() items: any[] = [];
  @Input() verticalLines: boolean = true;
  @Input() expansion: '' | 'multiple' | 'single' | string = 'multiple';
  @Input() selection: '' | 'single' | 'multiple' | 'single-leaf' | 'multiple-leaf' | string  = '';
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

  itemTemplate?: TemplateRef<any>;
  prependTemplate?: TemplateRef<any>;
  appendTemplate?: TemplateRef<any>;

  @ContentChildren(TemplateDirective) set templates(value: QueryList<TemplateDirective>) {
    this.itemTemplate = value.find(x => x.name == "item")?.template;
    this.prependTemplate = value.find(x => x.name == "prepend")?.template;
    this.appendTemplate = value.find(x => x.name == "append")?.template;
  }

  roots: TreeItem[] = [];
  optimizedItems: TreeItem[] = [];

  override ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);

    if(changes['items']) {
      this.optimizedItems = this.getOptimizedItems();
    }
  }

  override render() {
    super.render();

    this.classes['vertical-lines'] = this.verticalLines;

    this.roots = this.optimizedItems.filter(x => !x.parent);
  }

  private getOptimizedItems(): TreeItem[] {
    const result: TreeItem[] = [];
    this.items.forEach(item => {
      result.push({
        key: item[this.fields.key],
        value: item,
        parentKey: item[this.fields.parent],
      });
    });
    result.forEach(x => {
      x.parent = result.find(y => y.key == x.parentKey);
      x.children = result.filter(y => y.parentKey == x.key);
    })
    return result;
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
}
