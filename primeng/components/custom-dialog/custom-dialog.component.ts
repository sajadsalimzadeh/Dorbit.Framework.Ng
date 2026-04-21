import { Component, ContentChild, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from "@angular/core";
import { Dialog } from "primeng/dialog";

type Position = "center" | "top" | "bottom" | "left" | "right" | "topleft" | "topright" | "bottomleft" | "bottomright";

const styleFields = ['maximize', 'size']

@Component({
    standalone: false,
    selector: 'p-custom-dialog',
    templateUrl: './custom-dialog.component.html',
    styleUrl: './custom-dialog.component.scss'
})

export class CustomDialogComponent implements OnInit, OnChanges {
    @Input() visible: boolean = false;
    @Input() header: string = '';
    @Input() modal: boolean = true;
    @Input() dismissableMask: boolean = false;
    @Input() closable: boolean = true;
    @Input() draggable: boolean = false;
    @Input() resizable: boolean = false;
    @Input() closeOnEscape: boolean = true;
    @Input() baseZIndex: number = 1000;
    @Input() breakpoints: any;
    @Input() maximizable: boolean = false;
    @Input() position: Position = 'top';
    @Input() fullHeight: boolean = false;
    @Input() showHeader: boolean = true;
    @Input() appendTo?: string;
    
    @Input() dialogStyle: any = {};
    @Input() maskStyle: any = {};
    @Input() contentStyle: any = {};

    @Input() dialogStyleClass: string = '';
    @Input() maskStyleClass: string = '';
    @Input() contentStyleClass: string = '';

    @Input() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' = 'md';
    @Input() maximize: boolean = false;
    @Input() overflow: 'auto' | 'visible' = 'auto';

    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() onHide = new EventEmitter();

    @ViewChild(Dialog) dialog?: Dialog;

    @ContentChild(TemplateRef) template?: TemplateRef<any>;

    constructor(private elementRef: ElementRef) {
    }

    ngOnInit(): void {
        this.processStyles();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['visible'] && this.visible) {
            this.onVisible();
        }
        if (changes['maximize']) {
            if (this.maximize) this.elementRef.nativeElement.style.setProperty('--dialog-padding', '0');
            else this.elementRef.nativeElement.style.removeProperty('--dialog-padding');
        }
        if (styleFields.find(x => changes[x])) {
            this.processStyles();
        }
    }

    processStyles() {
        let dialogStyle: any = {};
        let maskStyles: any = {};

        if (this.maximize) {
            dialogStyle['width'] = '100vw';
            dialogStyle['height'] = '100vh';
            dialogStyle['--dialog-padding'] = '0';
            dialogStyle['max-width'] = '100%';
            dialogStyle['max-height'] = '100%';
            dialogStyle['border-radius'] = '0';
            maskStyles['padding'] = '0';
        } else {
            if (this.size == 'xs') dialogStyle['width'] = '400px';
            else if (this.size == 'sm') dialogStyle['width'] = '576px';
            else if (this.size == 'md') dialogStyle['width'] = '768px';
            else if (this.size == 'lg') dialogStyle['width'] = '992px';
            else if (this.size == 'xl') dialogStyle['width'] = '1200px';
            else if (this.size == 'xxl') dialogStyle['width'] = '1400px';

            if (this.fullHeight) {
                dialogStyle.height = '100%';
            }

            dialogStyle['max-width'] = '100%';
            dialogStyle['max-height'] = '100%';
        }

        this.dialogStyle = {
            ...dialogStyle,
            ...this.dialogStyle
        };

        this.maskStyle = {
            ...maskStyles,
            ...this.maskStyle
        }
    }

    private onVisible() {
        this.processContentStyleClass();
    }

    private processContentStyleClass() {
        this.contentStyle['overflow'] = this.overflow;
    }
}
