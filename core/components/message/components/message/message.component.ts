import {ChangeDetectorRef, Component, ContentChildren, EventEmitter, Injector, Input, Output, QueryList, TemplateRef,} from '@angular/core';
import {TemplateDirective} from "../../../../directives/template.directive";
import {Message} from "../../models";
import {AbstractComponent} from "../../../abstract.component";

@Component({
    selector: 'd-message',
    templateUrl: 'message.component.html',
    styleUrls: ['./message.component.scss'],
    standalone: false
})
export class MessageComponent extends AbstractComponent {
    @Input() item!: Message;
    @Input() items!: Message[];
    @Input() timerEnable: boolean = true;

    @Output() onRemove = new EventEmitter<Message>();

    timer: number = 0;
    progress: number = 0;

    contentTemplate?: TemplateRef<any>;

    constructor(injector: Injector, private changeDetectionRef: ChangeDetectorRef) {
        super(injector);
    }

    @ContentChildren(TemplateDirective) set templates(value: QueryList<TemplateDirective>) {
        this.contentTemplate = value.find(x => x.includesName('default', true))?.template;
    }

    override ngOnInit() {
        if (this.item.color) {
            this.color = this.item.color;
        }
        if (this.item.size) this.size = this.item.size;

        if (typeof this.item.icon === 'undefined') {
            switch (this.color) {
                case 'primary':
                    this.item.icon = 'far fa-info-circle';
                    break;
                case 'secondary':
                    this.item.icon = 'far fa-exclamation-circle';
                    break;
                case 'warning':
                    this.item.icon = 'far fa-triangle-exclamation';
                    break;
                case 'success':
                    this.item.icon = 'far fa-check';
                    break;
                case 'link':
                    this.item.icon = 'far fa-link';
                    break;
                case 'danger':
                    this.item.icon = 'far fa-times-circle';
                    break;
            }
        }
        this.elementRef.nativeElement.classList.add('show');

        super.ngOnInit();

        if (this.item.duration) {
            const duration = this.item.duration;
            if (this.item.showTimer) {
                this.timer = this.item.duration;
                const progressEl = this.elementRef.nativeElement.querySelector('.progress') as HTMLElement;
                const speed = 50;
                const interval = setInterval(() => {
                    if (!this.timerEnable) return;
                    this.timer -= speed;
                    this.progress = (this.timer * 100 / duration);
                    progressEl.style.width = `${this.progress}%`;
                    if (this.timer < 0) {
                        this.timer = 0;
                        this.remove();
                        clearInterval(interval);
                    }
                }, this.item.timerInterval ?? speed);
            } else {
                setTimeout(() => {
                    this.remove();
                }, this.item.duration);
            }
        }
    }

    remove() {
        this.elementRef.nativeElement.classList.remove('show');
        this.changeDetectionRef.markForCheck();
        setTimeout(() => {
            const index = this.items.indexOf(this.item);
            if (index > -1) this.items.splice(index, 1);
            this.changeDetectionRef.markForCheck();
        }, 200);
    }
}
