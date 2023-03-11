import {Component} from "@angular/core";


@Component({
  selector: 'doc-layout',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {
  menus = [
    {text: 'Button', link: 'button', icon: 'far fa-computer-mouse'},
    {text: 'Timeline', link: 'timeline', icon: 'far fa-timeline'},
    {text: 'Data Table', link: 'data-table', icon: 'far fa-table'},
    {
      text: 'Forms', icon: 'far fa-input-text', children: [
        {text: 'Input', link: 'forms/input', icon: 'far fa-input-text'},
        {text: 'Date Picker', link: 'forms/date-picker', icon: 'far fa-calendar'},
        {text: 'Checkbox', link: 'forms/checkbox', icon: 'far fa-square-check'},
        {text: 'Radio', link: 'forms/radio', icon: 'far fa-list-radio'},
        {text: 'Rate', link: 'forms/rate', icon: 'far fa-star'},
        {text: 'Switch', link: 'forms/switch', icon: 'far fa-toggle-large-on'},
        {text: 'Select', link: 'forms/select', icon: 'far fa-ballot-check'},
        {text: 'Chips', link: 'forms/chips', icon: 'far fa-pen-field'},
        {text: 'Volume', link: 'forms/volume', icon: 'far fa-slider'},
      ]
    },
  ]
}
