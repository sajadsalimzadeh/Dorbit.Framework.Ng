import {Component, OnInit} from '@angular/core';
import {TableConfig} from "projects/core/src/components/table/models";
import {getTableData} from "../index.component";

@Component({
  selector: 'doc-table-paginator',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  data = getTableData();
  config = new TableConfig();
  filenames = ['index.component.html', 'index.component.ts'];

  ngOnInit(): void {
    this.config.paging.enable = true;
    this.config.paging.size = 10;
  }
}
