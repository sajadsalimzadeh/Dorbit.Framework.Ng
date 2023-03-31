import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {AbstractFormControl, createControlValueAccessor} from "../form-control.directive";

@Component({
  selector: 'd-color-picker',
  templateUrl: 'color-picker.component.html',
  styleUrls: ['../control.scss', './color-picker.component.scss'],
  providers: [createControlValueAccessor(ColorPickerComponent)]
})
export class ColorPickerComponent extends AbstractFormControl<string> implements AfterViewInit {

  @Input() canvasSize = 150;

  @ViewChild('colorEl') colorEl!: ElementRef<HTMLCanvasElement>;
  @ViewChild('hueEl') hueEl!: ElementRef<HTMLCanvasElement>;

  hueCtx?: CanvasRenderingContext2D;
  colorCtx?: CanvasRenderingContext2D;
  selector: 'hue' | 'color' | '' = '';
  selectedContext?: CanvasRenderingContext2D;

  hue: string = '#fff';
  heuPos: number = 0;
  onWindowMouseUp: any;

  ngAfterViewInit() {

    const colorCanvas = this.colorEl?.nativeElement;
    if(colorCanvas) {
      colorCanvas.width = this.canvasSize;
      colorCanvas.height = this.canvasSize;
      this.colorCtx = colorCanvas.getContext('2d') as CanvasRenderingContext2D;
    }

    const hueCanvas = this.hueEl?.nativeElement;
    if(hueCanvas) {
      hueCanvas.height = this.canvasSize;
      const hueCtx = hueCanvas.getContext('2d') as CanvasRenderingContext2D;
      const gradient = hueCtx.createLinearGradient(0, 0, 0, hueCtx.canvas.height);
      gradient.addColorStop(0, "rgb(255, 0, 0)");
      gradient.addColorStop(0.15, "rgb(255, 0, 255)");
      gradient.addColorStop(0.33, "rgb(0, 0, 255)");
      gradient.addColorStop(0.49, "rgb(0, 255, 255)");
      gradient.addColorStop(0.67, "rgb(0, 255, 0)");
      gradient.addColorStop(0.84, "rgb(255, 255, 0)");
      gradient.addColorStop(1, "rgb(255, 0, 0)");
      hueCtx.fillStyle = gradient;
      hueCtx.fillRect(0, 0, hueCtx.canvas.width, hueCtx.canvas.height);
      this.hueCtx = hueCtx;
    }

    this.render();
  }

  override render() {
    super.render();

    if(this.colorCtx) {
      console.log(this.colorCtx.canvas.width, this.colorCtx.canvas.height)
      this.colorCtx.clearRect(0, 0, this.colorCtx.canvas.width, this.colorCtx.canvas.height);

      this.colorCtx.fillStyle = '#fff';
      this.colorCtx.fillRect(0, 0, this.colorCtx.canvas.width, this.colorCtx.canvas.height);

      const gradientH = this.colorCtx.createLinearGradient(0 , 0, this.colorCtx.canvas.width, 0);
      gradientH.addColorStop(0, 'rgba(0,0,0,0)');
      gradientH.addColorStop(1, this.hue);
      this.colorCtx.fillStyle = gradientH;
      this.colorCtx.fillRect(0, 0, this.colorCtx.canvas.width, this.colorCtx.canvas.height);

      let gradientV = this.colorCtx.createLinearGradient(0, 0, 0, this.colorCtx.canvas.height);
      gradientV.addColorStop(0, "rgba(0, 0, 0, 0)");
      gradientV.addColorStop(1, "rgba(0, 0, 0, 1)");
      this.colorCtx.fillStyle = gradientV;
      this.colorCtx.fillRect(0, 0, this.colorCtx.canvas.width, this.colorCtx.canvas.height);
    }
  }

  onSelectorMouseDown(e: MouseEvent, type: 'color' | 'hue') {
    this.selector = type;
    if(type == 'color') this.selectedContext = this.colorCtx;
    else if(type == 'hue') this.selectedContext = this.hueCtx;

    window.removeEventListener('mouseup', this.onWindowMouseUp);
    window.addEventListener('mouseup', this.onWindowMouseUp = (we: MouseEvent) => {
      this.selector = '';
    })
  }

  onSelectorMouseMove(e: MouseEvent, type: 'color' | 'hue') {
    if(this.selector === type && this.selectedContext) {
      e.stopPropagation();
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const imageData = this.selectedContext.getImageData(x, y,1, 1);
      const pixel = imageData.data;
      const color = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
      if(type == 'hue') {
        this.hue = color;
        this.render();
      } else {
        this.formControl.setValue(color);
      }
    }
  }
}
