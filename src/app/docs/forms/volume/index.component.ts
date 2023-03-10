import {Component, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'doc-button',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  loadings: any = {};
  formControlSingle = new FormControl(50);
  formControlMultiple = new FormControl({start: 20, end: 80});
  formControlMultiple2 = new FormControl({start: 500, end: 4500});

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
