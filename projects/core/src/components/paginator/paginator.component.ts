import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {AbstractComponent} from "../abstract.component";

@Component({
  selector: 'd-paginator',
  templateUrl: 'paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent extends AbstractComponent implements OnChanges {

  @Input() page: number = 0;
  @Input() pageSize: number = 10;
  @Input() totalCount!: number;

  @Input() showArrows: boolean = true;
  @Input() showNextArrow: boolean = true;
  @Input() showPrevArrow: boolean = true;
  @Input() showFirstArrow: boolean = true;
  @Input() showLastArrow: boolean = true;

  @Output() onChange = new EventEmitter<number>();

  pageNumbers: number[] = [];

  override ngOnChanges(changes: SimpleChanges): void {
    this.render();
  }

  select(page: number) {
    if (!page || page < 0 || page > this.pageNumbers[this.pageNumbers.length - 1]) return;
    this.onChange.emit(page - 1);
  }

  override render() {
    super.render();

    const lastPage = Math.ceil(this.totalCount / this.pageSize);
    if (!this.page) this.page = 0;
    if (this.page > lastPage) this.page = lastPage - 1;
    const currentPageNumber = this.page + 1;

    if (lastPage <= 7) {
      this.pageNumbers = [];
      for (let i = 1; i <= lastPage; i++) {
        this.pageNumbers.push(i);
      }
    } else {
      this.pageNumbers = [currentPageNumber];
      for (let i = 1; this.pageNumbers.length < 7; i++) {
        if (currentPageNumber - i > 0) this.pageNumbers.unshift(currentPageNumber - i);
        if (currentPageNumber + i <= lastPage) this.pageNumbers.push(currentPageNumber + i);
      }
      this.pageNumbers[0] = 1;
      if (this.pageNumbers[1] != 2) {
        this.pageNumbers[1] = 0;
      }
      if (this.pageNumbers[this.pageNumbers.length - 2] != lastPage - 1) {
        this.pageNumbers[this.pageNumbers.length - 2] = 0;
      }
      this.pageNumbers[this.pageNumbers.length - 1] = lastPage;
    }

    if(this.pageNumbers.length == 0) this.pageNumbers.push(1);
  }
}
