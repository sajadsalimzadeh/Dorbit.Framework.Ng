import {AfterContentInit, Component, ContentChildren, Input, QueryList} from '@angular/core';
import {Stepper} from "../../utils/stepper";
import {StepperStepDirective} from "./directives/step.directive";
import {AbstractComponent} from "../abstract.component";
import {CommonModule} from "@angular/common";

export * from './directives/step.directive'

@Component({
    standalone: true,
    imports: [CommonModule],
    selector: 'd-stepper',
    templateUrl: './stepper.component.html',
    styleUrls: ['./stepper.component.scss']
})
export class StepperComponent extends AbstractComponent implements AfterContentInit {
    @Input({required: true}) stepper!: Stepper<any>;
    @Input() showNavigation: boolean = true;

    @ContentChildren(StepperStepDirective) steps?: QueryList<StepperStepDirective>;

    activeStep?: StepperStepDirective;
    activeStepIndex: number = -1;

    override ngOnInit() {
        super.ngOnInit();

        this.subscription.add(this.stepper.$change.subscribe(e => {
            this.processActiveStep();
        }));
    }

    ngAfterContentInit(): void {
        this.processActiveStep();
    }

    processActiveStep() {
        const steps = this.steps ? [...this.steps] : [];
        this.activeStep = steps.find(x => x.key == this.stepper.step);
        this.activeStepIndex = (this.activeStep ? steps.indexOf(this.activeStep) : -1);
    }

    goto(step: StepperStepDirective, index: number) {
        if (index < this.activeStepIndex) {
            this.stepper.go(step.key);
        }
    }
}
