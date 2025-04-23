import {Component} from '@angular/core';

@Component({
    selector: 'doc-paginator',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss']
})
export class IndexComponent {
    page = 0;
    totalCount = 1000;
}
