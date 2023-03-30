import {Component, OnInit} from '@angular/core';
import mockData from "./mock-data";
import {DataTableConfig} from "projects/core/src/components/table/models";

@Component({
  selector: 'doc-data-table',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  items: any[] = [];
  config = new DataTableConfig();

  constructor() {
  }

  ngOnInit(): void {
    this.config.paging.size = 10;
    this.config.selecting.mode = 'multiple';
    this.config.sorting.field = 'id';
    // this.config.settings.selectMultipleWithMetaKey = true;
    this.load();
  }

  load() {
    this.items = mockData;
  }
}
