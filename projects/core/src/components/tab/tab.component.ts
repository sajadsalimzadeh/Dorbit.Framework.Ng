import {
  Component, ContentChildren, EventEmitter, Input, Output, QueryList,
} from '@angular/core';
import {BaseComponent} from "../base.component";
import {Orientation} from "../../types";
import {TabTemplateDirective} from "./components/tab-template.directive";

@Component({
  selector: 'd-tab',
  templateUrl: 'tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent extends BaseComponent {
  @Input() orientation: Orientation = 'horizontal';

  @Output() onTabChange = new EventEmitter<string>();

  activeTab?: TabTemplateDirective;
  tabsTemplates: TabTemplateDirective[] = [];

  @ContentChildren(TabTemplateDirective) set templates(value: QueryList<TabTemplateDirective>) {
    this.tabsTemplates = value.filter(x => x.includesName('tab'));
    if (!this.activeTab && this.tabsTemplates.length > 0) {
      this.setTab(this.tabsTemplates[0]);
    }
  }

  override render() {
    super.render();

    this.classes[this.orientation] = true;
  }

  setTab(tab: TabTemplateDirective) {
    this.onTabChange.emit(tab.key);
    this.activeTab = tab;
  }
}
