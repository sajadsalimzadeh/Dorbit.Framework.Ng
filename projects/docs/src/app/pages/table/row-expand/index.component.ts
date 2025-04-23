import {Component} from '@angular/core';
import {TableConfig} from "projects/core/src/components/table/models";
import {getTableData} from "../index.component";

@Component({
    selector: 'doc-table-row-expand',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss']
})
export class IndexComponent {
    data = getTableData();
    config = new TableConfig();
    filenames = ['index.component.html', 'index.component.ts'];
}
