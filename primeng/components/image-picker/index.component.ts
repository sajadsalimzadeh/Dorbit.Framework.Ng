import { Component, EventEmitter, Injector, Input, Output, ViewChild } from "@angular/core";
import { ImageCroppedEvent, ImageCropperComponent, OutputFormat } from "ngx-image-cropper";
import { NgxImageCompressService } from "ngx-image-compress";
import { PrimengComponent } from "../primeng.component";

export interface ImagePickerEvent {
    filename: string;
    output: string;
}

@Component({
    standalone: false,
    selector: 'p-image-picker',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss']
})
export class ImagePickerComponent extends PrimengComponent {
    @Input() ratio: number = 100;
    @Input() quality: number = 50;
    @Input() maxWidth?: number = undefined;
    @Input() maxHeight?: number = undefined;
    @Input() format: OutputFormat = 'png';
    @Input() output: 'base64' | 'upload' = 'upload';

    @Output() onCropped = new EventEmitter<ImageCroppedEvent>();
    @Output() onSelected = new EventEmitter<ImagePickerEvent>();

    @ViewChild(ImageCropperComponent) imageCropperEl!: ImageCropperComponent;

    croppedImage: ImageCroppedEvent | null = null;

    imageFilename: string | null = null;
    imageChangedEvent: Event | null = null;

    constructor(
        injector: Injector,
        private imageCompress: NgxImageCompressService,
    ) {
        super(injector);
    }

    protected onFileSelected(event: Event): void {
        if (event.target) {
            const input = event.target as HTMLInputElement;
            this.imageFilename = input.files?.[0]?.name ?? '';
            this.imageChangedEvent = event;
            this.showDialog('cropper');
        }
    }

    protected imageCropped(event: ImageCroppedEvent) {
        this.onCropped.emit(event);
        this.croppedImage = event;
    }

    protected confirmCroppedImage() {
        if (this.croppedImage?.base64) {
            this.compressImage(this.croppedImage.base64);
        }
    }

    protected async compressImage(imageBase64: string): Promise<void> {
        const compressedImage = await this.imageCompress.compressFile(imageBase64, -1, this.ratio, this.quality, this.maxWidth, this.maxHeight);
        if (this.imageFilename) {
            const filename = this.imageFilename;
            if (this.output === 'base64') {
                this.onSelected.emit({ filename, output: compressedImage });
                this.hideDialog('cropper');
            } else {
                this.fileRepository.uploadBase64(compressedImage, this.imageFilename).subscribe(res => {
                    if (res.data) {
                        this.onSelected.emit({ filename, output: res.data });
                        this.hideDialog('cropper');
                    }
                });
            }
        }
    }

    click() {
        this.elementRef.nativeElement.querySelector('input')?.click();
    }
}
