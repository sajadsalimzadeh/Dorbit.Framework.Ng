import {Component, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'doc-rate',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  loadings: any = {};
  formControl = new FormControl(3);

  constructor() {
  }

  ngOnInit(): void {

  }

  startLoading(name: string) {
    this.loadings[name] = true;
    setTimeout(() => {
      // this.loadings[name] = false;
    }, 1000)
  }
}
