import {Component, OnInit} from '@angular/core';
import {TimelineConfig} from "../../components/timeline/models";

@Component({
  selector: 'doc-timeline',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  items: any[] = [
    {text: 'Test text', date:'1993'},
    {text: 'Test text', date:'1999'},
    {text: 'Test text', date:'2003'},
    {text: 'Test text', date:'2008'},
    {text: 'Test text', date:'2012'},
    {text: 'Test text', date:'2013'},
    {text: 'Test text', date:'2017'},
    {text: 'Test text', date:'2019'},
  ];
  config = new TimelineConfig();

  constructor() {
  }

  ngOnInit(): void {
    this.config.direction = 'horizontal';
    this.config.align = 'alternate';
  }
}
