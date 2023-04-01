import {Component, OnInit} from '@angular/core';
import mockData from "../mock-data";
import {DataTableConfig} from "projects/core/src/components/table/models";

@Component({
  selector: 'doc-table-sort',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  items: any[] = mockData.slice(0, 10);
  filenames = ['index.component.html', 'index.component.ts'];
  config = new DataTableConfig();

  ngOnInit(): void {
    this.config.sorting.enable = true;
    this.config.sorting.field = 'id';
  }
}
