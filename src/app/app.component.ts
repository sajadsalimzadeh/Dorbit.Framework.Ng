import {Component, OnInit} from '@angular/core';
import mockData from "./mock-data";
import {DataTableConfig} from "./components/data-table/models";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  dateValue = '';
  items: any[] = [];
  config = new DataTableConfig();

  constructor() {
  }

  ngOnInit(): void {
    this.config.paging.limit = 10;
    this.load();
  }

  load() {
    this.items = mockData;
  }
}
