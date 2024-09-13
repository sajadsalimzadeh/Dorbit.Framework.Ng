import {Component, Injector, Input} from '@angular/core';
import {JobRepository} from "../../../repositories";
import {JobDto, JobLogDto, JobLogLevel} from "../../../contracts";
import {BaseComponent, LoadingService} from "@framework";

@Component({
  selector: 'app-logs',
  templateUrl: 'index.component.html',
  styleUrls: ['./index.component.scss'],
  providers: [LoadingService]
})
export class LogComponent extends BaseComponent {
  protected readonly LogLevel = JobLogLevel;

  @Input({required: true}) job!: JobDto;

  logLevel: JobLogLevel = JobLogLevel.Error;
  page = 0;
  limit = 500;
  pageCount = 0;
  items: JobLogDto[] = [];
  itemsFiltered:JobLogDto[] = [];

  constructor(injector: Injector, private jobRepository: JobRepository) {
    super(injector);

    jobRepository.loadingService = this.loadingService;
  }

  override ngOnInit() {
    super.ngOnInit();

    this.load();
  }

  load() {
    this.items = [];
    this.jobRepository.getAllLog(this.job.id, {logLevel: this.logLevel}).subscribe(res => {
      this.items = res.data ?? [];
      this.page = 0;
      this.process();
    })
  }


  process() {
    this.itemsFiltered = this.items.slice(this.page * this.limit, (this.page + 1) * this.limit)
    this.pageCount = Math.floor(this.items.length / this.limit);
  }

  setLevel(level: JobLogLevel) {
    this.logLevel = level;
    this.load();
  }

  prev() {
    this.page = this.page - 1;
    if(this.page < 0) this.page = 0;
    this.process();
  }

  next() {
    this.page = this.page + 1;
    if(this.page >= this.pageCount) this.page = this.pageCount;
    this.process();
  }
}
