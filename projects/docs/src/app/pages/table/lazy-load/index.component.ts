import {Component, OnInit} from '@angular/core';
import {getTableData} from "../index.component";

@Component({
  selector: 'doc-table-lazy-load',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  data = getTableData();
  filenames = ['index.component.html', 'index.component.ts'];

  ngOnInit(): void {
    this.load();
  }

  load() {
    // this.items = mockData;
  }
}
