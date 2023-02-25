import {Component, ContentChildren, Input, OnChanges, QueryList, SimpleChanges, TemplateRef} from "@angular/core";
import {TimelineConfig} from "./models";
import {TemplateDirective} from "../../directives/template/template.directive";
import {config} from "rxjs";

@Component({
  selector: 'dev-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnChanges {
  @Input() items: any[] = [];
  @Input() config = new TimelineConfig();
  @Input() size = 0;

  style: any = {};

  pointTemplate?: TemplateRef<any>;
  contentTemplate?: TemplateRef<any>;
  oppositeTemplate?: TemplateRef<any>;

  @ContentChildren(TemplateDirective) set templates(value: QueryList<TemplateDirective>) {
    this.pointTemplate = value.find(x => x.name == 'point')?.template;
    this.oppositeTemplate = value.find(x => x.name == 'opposite')?.template;
    this.contentTemplate = value.find(x => !x.name || x.name == 'content')?.template;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.render();
  }

  render() {
    this.style['height'] = (this.config.direction == 'vertical' && this.size ? this.size + 'px' : 'auto');
    this.style['width'] = (this.config.direction == 'horizontal' && this.size ? this.size + 'px' : 'auto');
  }
}
