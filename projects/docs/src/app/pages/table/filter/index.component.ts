import {Component} from '@angular/core';
import {TableConfig} from "projects/core/src/components/table/models";
import {getTableData} from "../index.component";

@Component({
  selector: 'doc-data-table',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {
  data = getTableData();
  config = new TableConfig();
  filenames = ['index.component.html', 'index.component.ts'];

  ngOnInit(): void {
    this.config.paging.size = 10;
    this.config.selecting.mode = 'multiple';
    this.config.sorting.field = 'id';
  }
}
