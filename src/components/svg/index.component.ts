import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Component({
    standalone: false,
    selector: 'app-svg',
    templateUrl: './index.component.html',
    styleUrl: './index.component.scss'
})

export class SvgComponent implements OnInit, OnChanges {
    @Input({required: true}) src?: string;

    constructor(private http: HttpClient, private element: ElementRef) {

    }

    ngOnInit() {
        this.load();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.load();
    }

    load() {
        if (this.src) {
            this.http.get(this.src, {responseType: 'text'}).subscribe(res => {
                this.element.nativeElement.innerHTML = res;
            })
        }
    }
}
