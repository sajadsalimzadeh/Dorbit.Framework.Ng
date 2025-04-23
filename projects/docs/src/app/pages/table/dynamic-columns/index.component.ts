import {Component} from '@angular/core';
import {getTableData} from "../index.component";

@Component({
    selector: 'doc-data-table-dynamic-columns',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss']
})
export class IndexComponent {
    data = getTableData();
    filenames = ['index.component.html', 'index.component.ts'];
    columns = [
        {title: 'Id', field: 'id'},
        {title: 'Firstname', field: 'first_name'},
        {title: 'Lastname', field: 'last_name'},
        {title: 'Email', field: 'email'},
        {title: 'Gender', field: 'gender'},
        {title: 'IP Address', field: 'ip_address'},
    ]
}
