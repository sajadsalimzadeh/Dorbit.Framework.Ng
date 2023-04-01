import {Component} from '@angular/core';
import mockData from "../mock-data";
import {DataTableConfig} from "projects/core/src/components/table/models";

@Component({
  selector: 'doc-data-table',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {
  items: any[] = mockData.slice(0, 10);
  filenames = ['index.component.html', 'index.component.ts'];
  config = new DataTableConfig();

  ngOnInit(): void {
    this.config.paging.size = 10;
    this.config.selecting.mode = 'multiple';
    this.config.sorting.field = 'id';
    // this.config.settings.selectMultipleWithMetaKey = true;
  }
}
