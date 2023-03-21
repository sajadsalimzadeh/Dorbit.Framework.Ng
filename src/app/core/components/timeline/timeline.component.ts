import {Component, ContentChildren, Input, OnChanges, QueryList, SimpleChanges, TemplateRef} from "@angular/core";
import {DevTemplateDirective} from "../../directives/template/dev-template.directive";

@Component({
  selector: 'dev-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnChanges {
  @Input() items: any[] = [];
  @Input() direction: 'vertical' | 'horizontal' = 'horizontal';
  @Input() align: 'start' | 'end' | 'alternate' = 'alternate';
  @Input() size = 0;

  style: any = {};

  pointTemplate?: TemplateRef<any>;
  contentTemplate?: TemplateRef<any>;
  oppositeTemplate?: TemplateRef<any>;

  @ContentChildren(DevTemplateDirective) set templates(value: QueryList<DevTemplateDirective>) {
    this.pointTemplate = value.find(x => x.name == 'point')?.template;
    this.oppositeTemplate = value.find(x => x.name == 'opposite')?.template;
    this.contentTemplate = value.find(x => !x.name || x.name == 'content')?.template;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.render();
  }

  render() {
    this.style['height'] = (this.direction == 'vertical' && this.size ? this.size + 'px' : 'auto');
    this.style['width'] = (this.direction == 'horizontal' && this.size ? this.size + 'px' : 'auto');
  }
}
