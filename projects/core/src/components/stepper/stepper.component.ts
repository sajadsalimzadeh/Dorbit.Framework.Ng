import {AfterContentInit, Component, ContentChildren, Input, QueryList} from '@angular/core';
import {Stepper} from "../../utils/stepper";
import {StepDirective} from "./components/step.directive";
import {AbstractComponent} from "../abstract.component";

@Component({
  selector: 'd-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent extends AbstractComponent implements AfterContentInit {
  @Input({required: true}) stepper!: Stepper<any>;
  @Input() showNavigation: boolean = true;

  @ContentChildren(StepDirective) steps?: QueryList<StepDirective>;

  activeStep?: StepDirective;
  activeStepIndex: number = -1;

  override ngOnInit() {
    super.ngOnInit();

    this.subscription.add(this.stepper.onChange.subscribe(e => {
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

  goto(step: StepDirective, index: number) {
    if(index < this.activeStepIndex) {
      this.stepper.go(step.key);
    }
  }
}
