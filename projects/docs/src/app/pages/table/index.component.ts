import {Component} from '@angular/core';
import mockData from "./mock-data";
import {TableConfig, TableData} from "@framework";

export function getTableData(from = 0, to = 10): TableData {
    const items = mockData.slice(from, to);
    return {
        items: items,
        totalCount: items.length,
    }
}

@Component({
    selector: 'doc-data-table',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss']
})
export class IndexComponent {
    data = getTableData();
    config = new TableConfig();
    filenames = ['index.component.html', 'index.component.ts'];

    constructor() {
    }

    ngOnInit(): void {
        this.config.paging.size = 10;
        this.config.selecting.mode = 'multiple';
        this.config.sorting.field = 'id';
        // this.config.settings.selectMultipleWithMetaKey = true;
    }
}
