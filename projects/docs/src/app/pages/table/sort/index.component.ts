import {Component, OnInit} from '@angular/core';
import {TableConfig} from "projects/core/src/components/table/models";
import {getTableData} from "../index.component";

@Component({
    selector: 'doc-table-sort',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
    data = getTableData(0, 1000);
    config = new TableConfig();
    filenames = ['index.component.html', 'index.component.ts'];

    ngOnInit(): void {
        this.config.sorting.enable = true;
        this.config.sorting.field = 'id';
    }
}
