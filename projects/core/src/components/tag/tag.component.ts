import {Component, Input,} from '@angular/core';
import {AbstractComponent} from "../abstract.component";
import {CommonModule} from "@angular/common";

@Component({
    standalone: true,
    imports: [CommonModule],
    selector: 'd-tag',
    templateUrl: 'tag.component.html',
    styleUrls: ['./tag.component.scss'],
})
export class TagComponent extends AbstractComponent {
  @Input() icon?: string;
  @Input() rounded: boolean = false;

  override render() {
    super.render();

    this.setClass('rounded', this.rounded);
  }
}
