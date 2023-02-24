import {Component, ContentChildren, QueryList, TemplateRef} from "@angular/core";
import {TimelineConfig} from "./models";
import {TemplateDirective} from "../../directives/template/template.directive";

@Component({
  selector: 'dev-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent {
  items: any[] = [];
  config = new TimelineConfig();

  contentTemplate?: TemplateRef<any>;

  @ContentChildren(TemplateDirective) set templates(value: QueryList<TemplateDirective>) {
    this.contentTemplate = value.find(x => !x.name || x.name == 'content')?.template;
  }
}
