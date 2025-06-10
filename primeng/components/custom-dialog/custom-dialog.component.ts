import {Component, ContentChild, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild} from "@angular/core";
import {Dialog} from "primeng/dialog";

type Position = "center" | "top" | "bottom" | "left" | "right" | "topleft" | "topright" | "bottomleft" | "bottomright";

const styleFields = ['maximize', 'size']

@Component({
    standalone: false,
    selector: 'p-custom-dialog',
    templateUrl: './custom-dialog.component.html',
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
    @Input() style: any;
    @Input() contentStyle: any = {};
    @Input() baseZIndex: number = 1000;
    @Input() styleClass: string = '';
    @Input() breakpoints: any;
    @Input() maximizable: boolean = false;
    @Input() position: Position = 'top';
    @Input() appendTo?: string;
    @Input() contentStyleClass?: string;
    @Input() fullHeight: boolean = false;
    @Input() showHeader: boolean = true;

    @Input() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
    @Input() maximize: boolean = false;
    @Input() overflow: 'auto' | 'visible' = 'auto';

    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() onHide = new EventEmitter();

    @ViewChild(Dialog) dialog?: Dialog;

    @ContentChild(TemplateRef) template?: TemplateRef<any>;

    ngOnInit(): void {
        this.processStyles();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['visible'] && this.visible) {
            this.onVisible();
        }
        if (styleFields.find(x => changes[x])) {
            this.processStyles();
        }
    }

    processStyles() {
        let sizeStyles: any;
        if (this.maximize) {
            this.style = {...this.style, width: '100vw', height: '100vh', 'max-height': 'calc(100% - 1.5rem)'};
        } else {
            if (this.size == 'xs') sizeStyles = {width: '400px'};
            else if (this.size == 'sm') sizeStyles = {width: '576px'};
            else if (this.size == 'md') sizeStyles = {width: '768px'};
            else if (this.size == 'lg') sizeStyles = {width: '992px'};
            else if (this.size == 'xl') sizeStyles = {width: '1200px'};

            if (this.fullHeight) {
                sizeStyles.height = '100%';
            }

            this.style = {
                ...sizeStyles,
                maxWidth: '100%',
                'max-height': 'calc(100% - 1.5rem)',
                ...this.style
            };
        }
    }

    private onVisible() {
        this.processContentStyleClass();
    }

    private processContentStyleClass() {
        this.contentStyle['overflow'] = this.overflow;
    }
}
