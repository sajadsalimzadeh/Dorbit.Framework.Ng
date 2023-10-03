import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {BaseComponent} from "@dorbit";

@Component({
  selector: 'd-code',
  templateUrl: 'code.component.html',
  styleUrls: ['./code.component.scss'],
})
export class CodeComponent extends BaseComponent implements AfterViewInit {
  @Input() data!: string;

  @ViewChild('codeContainerEl') codeContainerEl!: ElementRef<HTMLDivElement>;

  code?: string;

  ngAfterViewInit(): void {
    this.render();
  }
}
