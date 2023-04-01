import {Component, OnInit} from '@angular/core';
import mockData from "../mock-data";
import {DataTableConfig} from "projects/core/src/components/table/models";

@Component({
  selector: 'doc-table-lazy-load',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  items: any[] = mockData.slice(0, 10);
  filenames = ['index.component.html', 'index.component.ts'];

  ngOnInit(): void {
    this.load();
  }

  load() {
    // this.items = mockData;
  }
}
