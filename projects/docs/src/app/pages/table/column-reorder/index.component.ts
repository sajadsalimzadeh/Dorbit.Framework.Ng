import {Component} from '@angular/core';
import {getTableData} from "../index.component";

@Component({
    selector: 'doc-data-table-column-reorder',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss']
})
export class IndexComponent {
    data = getTableData();
    filenames = ['index.component.html', 'index.component.ts'];
}
