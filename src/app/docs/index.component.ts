import {Component} from "@angular/core";


@Component({
  selector: 'doc-layout',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {
  menus = [
    {text: 'Button', link: 'button'},
    {text: 'Checkbox', link: 'checkbox'},
    {text: 'Timeline', link: 'timeline'},
    {text: 'Data Table', link: 'data-table'},
    {
      text: 'Forms', children: [
        {text: 'Date Picker', link: 'forms/date-picker'}
      ]
    },
  ]
}
