import {Directive, ElementRef, HostListener, OnInit} from "@angular/core";

@Directive({
    standalone: true,
    selector: '[responsive]',
})
export class ResponsiveDirective implements OnInit {

    constructor(private elementRef: ElementRef) {
    }

    @HostListener('window:resize') onWindowResize() {
        this.render();
    }

    ngOnInit(): void {
        this.render();
    }

    render() {
        const element = this.elementRef.nativeElement as HTMLElement;

        const width = element.offsetWidth;
        element.classList.add('media-xs');
        if (width > 576) element.classList.add('media-sm');
        else element.classList.remove('media-sm');
        if (width > 768) element.classList.add('media-md');
        else element.classList.remove('media-md');
        if (width > 992) element.classList.add('media-lg');
        else element.classList.remove('media-lg');
        if (width > 1200) element.classList.add('media-xl');
        else element.classList.remove('media-xl');
        if (width > 1400) element.classList.add('media-xxl');
        else element.classList.remove('media-xxl');
    }
}
