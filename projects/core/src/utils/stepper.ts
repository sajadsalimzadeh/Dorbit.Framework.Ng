import {Subject} from "rxjs";

interface ChangeEvent<T> {
  leaveStep?: T;
  enterStep: T;
}

interface Validator<T> {
  leaveStep?: T;
  enterStep?: T;
  validator: () => Promise<boolean>;
}

export class Stepper<T> {
  _step: T;
  _validators: Validator<T>[] = [];

  onChange = new Subject<ChangeEvent<T>>();

  get step() {
    return this._step;
  }

  constructor(step: T) {
    this._step = step;
  }

  go(step: T) {
    const e: ChangeEvent<T> = {
      leaveStep: this._step,
      enterStep: step,
    };
    const validators = this._validators.filter(x =>
      (x.leaveStep == e.leaveStep && !x.enterStep) ||
      (x.enterStep == e.enterStep && !x.leaveStep) ||
      (x.leaveStep == e.leaveStep && x.enterStep == e.enterStep)
    ).map(x => x.validator());
    Promise.all(validators).then((values) => {
      if(values.indexOf(false) < 0) {
        this._step = step;
        this.onChange.next(e);
      }
    });
  }

  addValidator(validator: () => boolean, leaveStep?: T, enterStep?: T) {
    return this.addValidatorAsync(() => new Promise<boolean>((resolve, reject) => {
      resolve(validator());
    }), leaveStep, enterStep);
  }

  addValidatorAsync(validator: () => Promise<boolean>, leaveStep?: T, enterStep?: T) {
    this._validators.push({
      leaveStep: leaveStep,
      enterStep: enterStep,
      validator: validator
    });
    return this;
  }

  onEnter(step: T, callback: () => void) {
    this.onChange.subscribe(e => {
      if (e.enterStep == step) callback();
    });
    return this;
  }

  onLeave(step: T, callback: () => void) {
    this.onChange.subscribe(e => {
      if (e.enterStep == step) callback();
    });
    return this;
  }
}
