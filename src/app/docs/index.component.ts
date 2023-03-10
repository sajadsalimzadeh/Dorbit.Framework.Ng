import {Component} from "@angular/core";


@Component({
  selector: 'doc-layout',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {
  menus = [
    {text: 'Button', link: 'button'},
    {text: 'Timeline', link: 'timeline'},
    {text: 'Data Table', link: 'data-table'},
    {
      text: 'Forms', children: [
        {text: 'Date Picker', link: 'forms/date-picker'},
        {text: 'Checkbox', link: 'forms/checkbox'},
        {text: 'Radio', link: 'forms/radio'},
        {text: 'Rate', link: 'forms/rate'},
        {text: 'Switch', link: 'forms/switch'},
        {text: 'Input', link: 'forms/input'},
        {text: 'Select', link: 'forms/select'},
        {text: 'Chips', link: 'forms/chips'},
        {text: 'Volume', link: 'forms/volume'},
      ]
    },
  ]
}
