import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {DialogOptions, DialogService} from "@framework";

@Component({
  selector: 'doc-dialog',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  @ViewChild('positionTpl') basicTpl!: TemplateRef<any>;

  constructor(private dialogService: DialogService) {
  }

  create(options: DialogOptions) {
    this.dialogService.open({
      maxWidth: '600px',
      ...options
    });
  }

  ngOnInit(): void {

  }
}
