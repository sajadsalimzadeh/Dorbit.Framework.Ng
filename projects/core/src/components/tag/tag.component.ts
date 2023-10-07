import {Component, Input,} from '@angular/core';
import {BaseComponent} from "../base.component";

@Component({
  selector: 'd-tag',
  templateUrl: 'tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent extends BaseComponent {
  @Input() icon?: string;
  @Input() rounded: boolean = false;

  override render() {
    super.render();

    this.setClass('rounded', this.rounded);
  }
}
