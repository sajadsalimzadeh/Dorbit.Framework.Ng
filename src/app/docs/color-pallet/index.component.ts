import {Component} from '@angular/core';

@Component({
  selector: 'doc-color-pallet',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {
  _primaryColors = ['primary', 'secondary', 'success', 'warning', 'danger', 'link'];

  primaryColors: string[] = [];
  grayColors: string[] = [];


  constructor() {
    this._primaryColors.forEach(x => {
      this.primaryColors.push(x + '-tint');
      this.primaryColors.push(x);
      this.primaryColors.push(x + '-shade');
    });

    for (let i = 0; i <= 10; i++) {
      this.grayColors.push(`gray--${i}`);
    }

    for (let i = 10; i > 0; i--) {
      this.grayColors.push(`gray-${i}`);
    }
  }
}
