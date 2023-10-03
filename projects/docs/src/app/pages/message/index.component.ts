import {Component, OnInit} from '@angular/core';
import {Message, MessageService} from "@dorbit";

@Component({
  selector: 'doc-progress-bar',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  constructor(private messageService: MessageService) {
  }

  create(options: Message) {
    this.messageService.show({
      color: 'primary',
      title: 'Title',
      body: 'Message Content',
      removable: true,
      duration: 5000,
      ...options
    })
  }

  ngOnInit(): void {

  }
}
