import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedComponent } from '../../../../../app/components/shared.component';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { CancellationToken, QueryResult } from '@framework/contracts';

export interface GroupOperationItem {
    data: any;

    name: string;
    status: 'inprogress' | 'success' | 'error' | 'wait';
    message?: string;
}

interface Counts {
    inprogress: number;
    success: number;
    error: number;
    wait: number;
}

@Component({
    standalone: false,
    selector: 'p-group-operation-result',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
})
export class GroupOperationResultComponent extends SharedComponent {
    @Input({ required: true }) value!: any[];
    @Input() nameField: string = 'name';
    @Input({ required: true }) action!: (item: any, cancelationToken: CancellationToken) => Promise<QueryResult>;

    @Output() onComplete = new EventEmitter<void>();

    items: GroupOperationItem[] = [];

    counts?: Counts;

    isLoading: boolean = false;
    isStopOnError: boolean = true;
    cancelationToken = new CancellationToken();

    override ngOnInit() {
        this.items = this.value.map(item => ({
            data: item,
            name: item[this.nameField],
            status: 'wait',
        }));
    }

    process() {
        const counts = {
            inprogress: 0,
            success: 0,
            error: 0,
            wait: 0,
        };
        this.items.forEach(item => {
            counts[item.status]++;
        });
        this.counts = counts;
    }

    async start(items: GroupOperationItem[]) {
        this.cancelationToken.cancel();
        this.cancelationToken = new CancellationToken();
        try {
            this.isLoading = true;
            for (const item of items.filter(item => item.status !== 'success')) {
                try {
                    item.status = 'inprogress';
                    const res = await this.action(item, this.cancelationToken);
                    item.status = res.success ? 'success' : 'error';
                    item.message = res.message;
                } catch (error) {
                    item.status = 'error';
                    item.message = (error instanceof Error) ? error.message : (typeof error === 'string' ? error : 'خطای ناشناخته');
                    if (this.isStopOnError) {
                        break;
                    }
                } finally {
                    this.process();
                }
            }
        } finally {
            this.isLoading = false;
        }
    }

    remove(item: GroupOperationItem) {
        this.items.splice(this.items.indexOf(item), 1);
    }

    startAll() {
        this.start(this.items);
    }

    startFailed() {
        this.start(this.items.filter(item => item.status === 'error'));
    }

    stop() {
        this.cancelationToken.cancel();
    }

    download() {

        const worksheet = XLSX.utils.json_to_sheet(this.items);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        const blob = new Blob([wbout], { type: 'application/octet-stream' });
        saveAs(blob, this.router.url.replaceAll('/', '-') + `-${Date.now()}.xlsx`);
    }

    close() {
        this.onComplete.emit();
    }
}