import {Component} from '@angular/core';

@Component({
  selector: 'doc-timeline',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {
  items: any[] = [
    {text: 'Test text', date:'1999'},
    {text: 'Test text', date:'2003'},
    {text: 'Test text', date:'2008'},
    {text: 'Test text', date:'2012'},
    {text: 'Test text', date:'2017'},
    {text: 'Test text', date:'2019'},
  ];
}
