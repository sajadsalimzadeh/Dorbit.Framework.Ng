import {
  Component, ContentChildren, Input, QueryList,
} from '@angular/core';
import {BaseComponent} from "../base.component";
import {Orientation} from "../../types";
import {TabTemplateDirective} from "./directive/tab-template.directive";

@Component({
  selector: 'd-tab',
  templateUrl: 'tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent extends BaseComponent {
  @Input() orientation: Orientation = 'horizontal';

  activeTab?: TabTemplateDirective;
  tabsTemplates: TabTemplateDirective[] = [];

  @ContentChildren(TabTemplateDirective) set templates(value: QueryList<TabTemplateDirective>) {
    this.tabsTemplates = value.filter(x => x.includesName('tab'));
    if (this.tabsTemplates.length > 0) {
      this.activeTab = this.tabsTemplates[0];
    }
  }

  override render() {
    super.render();

    this.classes[this.orientation] = true;
  }
}