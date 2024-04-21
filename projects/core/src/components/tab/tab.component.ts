import {Component, ContentChildren, HostBinding, Input, QueryList,} from '@angular/core';
import {Orientation} from "../../types";
import {TabTemplateDirective} from "./components/tab-template.directive";
import {AbstractFormControl, createControlValueAccessor} from "../form";

@Component({
  selector: 'd-tab',
  templateUrl: 'tab.component.html',
  styleUrls: ['./tab.component.scss'],
  providers: [createControlValueAccessor(TabComponent)]
})
export class TabComponent extends AbstractFormControl<any> {
  @Input() orientation: Orientation = 'horizontal';
  @HostBinding('class.header-fill') @Input() headerFill: boolean = true;

  activeTab?: TabTemplateDirective;
  tabsTemplates: TabTemplateDirective[] = [];

  @ContentChildren(TabTemplateDirective) set templates(value: QueryList<TabTemplateDirective>) {
    this.tabsTemplates = value.toArray();
    if (!this.activeTab && this.tabsTemplates.length > 0) {
      this.setTab(this.tabsTemplates[0]);
    }
  }

  override ngOnInit() {
    super.ngOnInit();

    this.subscription.add(this.onChange.subscribe(e => {
      const tab = this.tabsTemplates.find(x => x.key == e);
      if (tab) this.setTab(tab)
    }))
  }

  override render() {
    super.render();

    this.setClass(this.orientation, true);
  }

  setTab(tab: TabTemplateDirective) {
    if (this.activeTab?.key == tab?.key) return;
    this.activeTab = tab;
    this.onChange.emit(tab.key);
    this.formControl?.setValue(tab.key)
  }
}
