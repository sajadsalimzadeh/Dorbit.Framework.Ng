import {Component, OnInit} from '@angular/core';
import {MessagesService} from "../../components/message/messages.service";
import {Colors, Sizes} from "../../types";
import {Message} from "../../components/message/models";

@Component({
  selector: 'doc-progress-bar',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  constructor(private messageService: MessagesService) {
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
