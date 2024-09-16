import {Component, Injector, TemplateRef} from '@angular/core';
import {CancellationToken} from "../../contracts";
import {BaseComponent, DialogOptions, TableData} from "../../components";
import {EnumUtil} from "../../utils";
import {JobRepository} from "../../repositories";
import {JobAuditLogType, JobDto, JobStatus} from "../../contracts";
import {saveAs} from 'file-saver';

@Component({
  selector: 'page-jobs',
  templateUrl: 'index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent extends BaseComponent {

  protected readonly JobAuditLogType = JobAuditLogType;
  protected readonly EnumUtil = EnumUtil;
  protected readonly JobStatus = JobStatus;

  data: TableData<JobDto> = {items: [], totalCount: 0};

  constructor(injector: Injector, private jobRepository: JobRepository) {
    super(injector);
  }

  watchCancellationToken = new CancellationToken();

  override ngOnInit() {
    super.ngOnInit();

    this.load();

    this.jobRepository.watchAll(this.watchCancellationToken).subscribe(e => {
      if (!e?.id) return;
      const job = this.data.items.find(x => x.id == e.id);
      if (!job) return;
      Object.assign(job, e);
    });
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.watchCancellationToken.cancel();
  }

  load() {
    this.jobRepository.getAll().subscribe(res => {
      this.data = {
        items: res.data ?? [],
        totalCount: res.data?.length ?? 0
      };
    })
  }

  cancel(item: JobDto) {
    this.jobRepository.cancel(item.id).subscribe(res => {
      this.load();
    })
  }

  pause(item: JobDto) {
    this.jobRepository.pause(item.id).subscribe(res => {
      this.load();
    })
  }

  resume(item: JobDto) {
    this.jobRepository.resume(item.id).subscribe(res => {
      this.load();
    });
  }

  download(item: JobDto) {
    this.jobRepository.download(item.id).subscribe(res => {
      saveAs(res, item.downloadFilename);
    });
  }

  showDialog(template: TemplateRef<any>, options: DialogOptions) {
    this.dialogService.open({
      template: template,
      ...options,
    })

  }
}
