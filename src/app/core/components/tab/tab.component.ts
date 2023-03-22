import {
  Component, ContentChildren, Input, QueryList,
} from '@angular/core';
import {BaseComponent} from "../base.component";
import {Orientation} from "../../types";
import {TemplateDirective} from "./directive/template.directive";

@Component({
  selector: 'dev-tab',
  templateUrl: 'tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent extends BaseComponent {
  @Input() orientation: Orientation = 'horizontal';

  activeTab?: TemplateDirective;
  tabsTemplates: TemplateDirective[] = [];

  @ContentChildren(TemplateDirective) set templates(value: QueryList<TemplateDirective>) {
    this.tabsTemplates = value.filter(x => x.name == 'tab');
    if (this.tabsTemplates.length > 0) {
      this.activeTab = this.tabsTemplates[0];
    }
  }

  override render() {
    super.render();

    this.classes[this.orientation] = true;
  }
}
