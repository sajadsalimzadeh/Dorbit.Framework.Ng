import {Component, Input, SimpleChanges} from '@angular/core';
import {AbstractComponent} from "../abstract.component";
import {NumberUtil} from "../../utils";

@Component({
  selector: 'd-progress-circle',
  templateUrl: 'progress-circle.component.html',
  styleUrls: ['./progress-circle.component.scss']
})

export class ProgressCircleComponent extends AbstractComponent {
  @Input({required: true}) diameter!: number;
  @Input() startDegree: number = 90;
  @Input() max: number = 100;
  @Input() value: number = 100;
  @Input() valueFractionDigits: number = 0;
  @Input() animate: boolean = true;
  @Input() animateDuration: number = 1000; // Milliseconds
  @Input() animateSlice: number = 50; // 10 ~ 100

  private svg: any;
  private slice: any;
  private overlay: any;
  private text: any;
  private strokeWidth: any;
  private radius: any;

  override ngOnInit() {
    super.ngOnInit();

    this.create();
  }

  override ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);

    if ('diameter' in changes) {
      this.create();
    }
    if ('value' in changes) {
      this.update();
    }
  }

  private create() {
    const container = this.elementRef.nativeElement;
    this.strokeWidth = this.diameter / 8;
    this.radius = this.diameter / 2 - this.strokeWidth / 2;
    container.childNodes.forEach(x => x.remove());
    this.createSvg();
    this.createOverlay();
    this.createSlice();
    this.createText();
    container.appendChild(this.svg);
    this.update();
  }

  private createSvg() {
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", `${this.diameter}px`);
    svg.setAttribute("height", `${this.diameter}px`);
    this.svg = svg;
  }

  private createSlice() {
    let slice = document.createElementNS("http://www.w3.org/2000/svg", "path");
    slice.setAttribute("stroke-width", this.strokeWidth);
    slice.setAttribute("transform", `translate(${this.strokeWidth / 2},${this.strokeWidth / 2})`);
    slice.setAttribute("class", "progress");
    this.svg.appendChild(slice);
    this.slice = slice;
  }

  private createOverlay() {
    const r = this.diameter - this.diameter / 2 - this.strokeWidth / 2;
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", (this.diameter / 2) + '');
    circle.setAttribute("cy", (this.diameter / 2) + '');
    circle.setAttribute("r", r + '');
    circle.setAttribute("stroke-width", this.strokeWidth);
    circle.setAttribute("class", "overlay");
    this.svg.appendChild(circle);
    this.overlay = circle;
  }

  private createText() {
    const fontSize = this.diameter / 3.5;
    let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", '50%');
    text.setAttribute("y", '50%');
    text.setAttribute("font-size", fontSize + '');
    text.innerHTML = NumberUtil.format(this.value, 2);
    this.svg.appendChild(text);
    this.text = text;
  }


  private polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
    const angleInRadians = ((angleInDegrees + this.startDegree) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  }

  private describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
    const start = this.polarToCartesian(x, y, radius, endAngle);
    const end = this.polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      "M",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y
    ].join(" ");
  }

  private preValue?: number;
  private interval: any;
  private update() {
    if (!this.slice) return;

    let value = (this.animate ? this.preValue : this.value) ?? this.value;
    const targetValue = this.value;
    this.preValue = this.value;
    const step = (this.max / this.animateSlice);
    clearInterval(this.interval);
    this.interval = setInterval(() => func(), (this.animateDuration / this.animateSlice));
    const func = () => {
      if (Math.abs(targetValue - value) < step) {
        clearInterval(this.interval);
        value = targetValue;
      }
      let c = (value / this.max) * 360;
      if (c === 360) c = 359.9999;
      const xy = this.diameter / 2 - this.strokeWidth / 2;
      const d = this.describeArc(xy, xy, xy, 180, 180 + c);
      this.slice.setAttribute("d", d);
      this.text.innerHTML = `${value.toFixed(this.valueFractionDigits)}`;
      if (targetValue > value) value += step;
      else value -= step;
    };
    func();
  }
}
