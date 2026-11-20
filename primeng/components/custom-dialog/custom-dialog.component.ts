import { ChangeDetectorRef, Component, ContentChild, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from "@angular/core";
import { Dialog } from "primeng/dialog";

type Position = "center" | "top" | "bottom" | "left" | "right" | "topleft" | "topright" | "bottomleft" | "bottomright";
type Size = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
type Overflow = 'auto' | 'visible';

const styleFields = ['maximize', 'size'];

export const CustomDialogComponentDefaults = {
    visible: false,
    header: '',
    modal: true,
    dismissableMask: false,
    closable: true,
    draggable: false,
    resizable: false,
    closeOnEscape: true,
    baseZIndex: 1000,
    breakpoints: undefined,
    maximizable: false,
    position: 'top' as Position,
    fullHeight: false,
    showHeader: true,
    appendTo: undefined,
    dialogStyle: {},
    maskStyle: {},
    contentStyle: {},
    dialogStyleClass: '',
    maskStyleClass: '',
    contentStyleClass: '',
    size: 'md' as Size,
    maximize: false,
    overflow: 'auto' as Overflow,
}

@Component({
    standalone: false,
    selector: 'p-custom-dialog',
    templateUrl: './custom-dialog.component.html',
    styleUrl: './custom-dialog.component.scss'
})

export class CustomDialogComponent implements OnInit, OnChanges {
    @Input() visible: boolean = CustomDialogComponentDefaults.visible;
    @Input() header: string = CustomDialogComponentDefaults.header;
    @Input() modal: boolean = CustomDialogComponentDefaults.modal;
    @Input() dismissableMask: boolean = CustomDialogComponentDefaults.dismissableMask;
    @Input() closable: boolean = true;
    @Input() draggable: boolean = CustomDialogComponentDefaults.draggable;
    @Input() resizable: boolean = CustomDialogComponentDefaults.resizable;
    @Input() closeOnEscape: boolean = true;
    @Input() baseZIndex: number = CustomDialogComponentDefaults.baseZIndex;
    @Input() breakpoints: any = CustomDialogComponentDefaults.breakpoints;
    @Input() maximizable: boolean = CustomDialogComponentDefaults.maximizable;
    @Input() position: Position = CustomDialogComponentDefaults.position;
    @Input() fullHeight: boolean = CustomDialogComponentDefaults.fullHeight;
    @Input() showHeader: boolean = CustomDialogComponentDefaults.showHeader;
    @Input() appendTo?: string = CustomDialogComponentDefaults.appendTo;
    
    @Input() dialogStyle: any = CustomDialogComponentDefaults.dialogStyle;
    @Input() maskStyle: any = CustomDialogComponentDefaults.maskStyle;
    @Input() contentStyle: any = CustomDialogComponentDefaults.contentStyle;

    @Input() dialogStyleClass: string = CustomDialogComponentDefaults.dialogStyleClass;
    @Input() maskStyleClass: string = CustomDialogComponentDefaults.maskStyleClass;
    @Input() contentStyleClass: string = CustomDialogComponentDefaults.contentStyleClass;

    @Input() size: Size = CustomDialogComponentDefaults.size;
    @Input() maximize: boolean = CustomDialogComponentDefaults.maximize;
    @Input() overflow: Overflow = CustomDialogComponentDefaults.overflow;

    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() onHide = new EventEmitter();

    @ViewChild(Dialog) dialog?: Dialog;

    @ContentChild(TemplateRef, {static: true}) template?: TemplateRef<any>;

    @HostListener('window:click', [])
    onWindowClick() {
        this.changeDetectorRef.detectChanges();
    }
    @HostListener('window:keydown.escape', [])
    onWindowEscape() {
        this.changeDetectorRef.detectChanges();
    }

    maskStyleInner: any = {};
    dialogStyleInner: any = {};
    dialogStyleClassInner: string = '';

    constructor(private elementRef: ElementRef, private changeDetectorRef: ChangeDetectorRef) {
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
        let dialogStyleClass: string = '';

        if (this.maximize) {
            dialogStyle['width'] = '100vw';
            dialogStyle['height'] = '100vh';
            dialogStyle['--dialog-padding'] = '0';
            dialogStyle['max-width'] = '100%';
            dialogStyle['max-height'] = '100%';
            dialogStyle['border-radius'] = '0';
            dialogStyle['padding'] = 'var(--app-inset-top, 0) var(--app-inset-right, 0) var(--app-inset-bottom, 0) var(--app-inset-left, 0)';
            maskStyles['padding'] = '0';

            dialogStyleClass = 'p-dialog-maximize';
        } else {
            if (this.size == 'xxs') dialogStyle['width'] = '350px';
            else if (this.size == 'xs') dialogStyle['width'] = '400px';
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

        this.dialogStyleInner = {
            ...dialogStyle,
            ...this.dialogStyle
        };

        this.maskStyleInner = {
            ...maskStyles,
            ...this.maskStyle
        }

        this.dialogStyleClassInner = dialogStyleClass + ' ' + this.dialogStyleClass;
    }

    private onVisible() {
        this.processContentStyleClass();
    }

    private processContentStyleClass() {
        this.contentStyle['overflow'] = this.overflow;
    }
}
