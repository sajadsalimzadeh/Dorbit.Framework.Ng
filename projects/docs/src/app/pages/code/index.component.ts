import {Component} from '@angular/core';

@Component({
  selector: 'doc-code',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {

  code = `
 <div class="control-box">
  <div class="control-container flex-1" [style.max-height]="maxHeight">
    <div class="item" *ngFor="let item of formControl.value; let index = index">
      <span class="text">{{item}}</span>
      <i class="remove far fa-times-circle" (click)="remove(index)"></i>
    </div>
    <input class="control" #inputEl [(ngModel)]="value" [placeholder]="placeholder"
           (ngModelChange)="onValueChange()" (focus)="focus()" (blur)="blur()" (keydown)="onInputKeyDown($event)"/>
  </div>
</div>
`;

  constructor() {
  }

}
