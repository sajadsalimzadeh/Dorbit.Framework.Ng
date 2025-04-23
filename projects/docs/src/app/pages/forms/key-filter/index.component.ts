import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'doc-key-filter',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

    loadings: any = {};

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
