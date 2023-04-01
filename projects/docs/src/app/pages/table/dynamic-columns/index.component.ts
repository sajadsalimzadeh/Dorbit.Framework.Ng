import {Component} from '@angular/core';
import mockData from "../mock-data";

@Component({
  selector: 'doc-data-table',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {
  items: any[] = mockData.slice(0, 10);
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
