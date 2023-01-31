import {Component, OnInit} from '@angular/core';
import mockData from "./mock-data";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  dateValue = '';
  items: any[] = [];

  constructor() {
  }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.items = mockData;
  }
}
