import {Component, ContentChildren, Input, OnChanges, QueryList, SimpleChanges, TemplateRef} from "@angular/core";
import {DevTemplateDirective} from "../../directives/template/dev-template.directive";
import {Orientation} from "../../types";
import {BaseComponent} from "../base.component";

@Component({
  selector: 'dev-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent extends BaseComponent {
  @Input() items: any[] = [];
  @Input() orientation: Orientation = 'horizontal';
  @Input() align: 'start' | 'end' | 'alternate' = 'alternate';

  style: any = {};

  pointTemplate?: TemplateRef<any>;
  contentTemplate?: TemplateRef<any>;
  oppositeTemplate?: TemplateRef<any>;

  @ContentChildren(DevTemplateDirective) set templates(value: QueryList<DevTemplateDirective>) {
    this.pointTemplate = value.find(x => x.name == 'point')?.template;
    this.oppositeTemplate = value.find(x => x.name == 'opposite')?.template;
    this.contentTemplate = value.find(x => !x.name || x.name == 'content')?.template;
  }
}
