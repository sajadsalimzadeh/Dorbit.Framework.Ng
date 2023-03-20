import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {DialogService} from "../../components/dialog/dialog.service";
import {DialogOptions} from "../../components/dialog/dialog.component";

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
    this.dialogService.show({
      maxWidth: '600px',
      ...options
    });
  }

  ngOnInit(): void {

  }
}
