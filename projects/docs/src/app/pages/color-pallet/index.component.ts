import {Component} from '@angular/core';

@Component({
    selector: 'doc-color-pallet',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss']
})
export class IndexComponent {
    primaryColors: { bg: string, text: string }[] = [];
    grayColors: { bg: string, text: string }[] = [];
    private _primaryColors = ['primary', 'secondary', 'success', 'warning', 'danger', 'link'];

    constructor() {
        this._primaryColors.forEach(x => {
            this.primaryColors.push({bg: x + '-tint', text: x + '-shade'});
            this.primaryColors.push({bg: x, text: 'white'});
            this.primaryColors.push({bg: x + '-shade', text: x + '-tint'});
        });

        for (let i = 0; i <= 10; i++) {
            this.grayColors.push({bg: `gray--${i}`, text: `gray-${i}`});
        }

        for (let i = 10; i > 0; i--) {
            this.grayColors.push({bg: `gray-${i}`, text: `gray--${i}`});
        }
    }
}
