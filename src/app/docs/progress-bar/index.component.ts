import {Component, OnDestroy, OnInit} from '@angular/core';

@Component({
  selector: 'doc-progress-bar',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {

  value: number = 0;

  interval: any;

  ngOnInit(): void {

    this.interval = setInterval(() => {
      this.value *= 1.1;
      this.value += 1;
      if(this.value > 100) {
        this.value = 1;
      }
    }, 500)
  }

  ngOnDestroy(): void {
    clearInterval(this.interval)
  }

}
