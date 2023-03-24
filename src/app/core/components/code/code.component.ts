import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {HtmlFormatter} from "./formatters/html";
import {BaseComponent} from "../base.component";
import {Formatter} from "./formatters/formatter";

@Component({
  selector: 'd-code',
  templateUrl: 'code.component.html',
  styleUrls: ['./code.component.scss'],
})
export class CodeComponent extends BaseComponent implements AfterViewInit {
  @Input() data!: string;
  @Input() formatter: Formatter = new HtmlFormatter();

  @ViewChild('codeContainerEl') codeContainerEl!: ElementRef<HTMLDivElement>;

  code?: string;

  ngAfterViewInit(): void {
    this.render();
  }

  override render() {
    super.render();

    if (this.codeContainerEl) {
      const codeEl = this.formatter.format(this.data)
      const containerEl = this.codeContainerEl.nativeElement;
      containerEl.innerHTML = '';
      containerEl.appendChild(codeEl);
    }
  }
}
