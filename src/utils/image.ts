export class ImageUtil {
    static getAverageRGB(imgEl: HTMLImageElement) {

        let blockSize = 5, // only visit every 5 pixels
            defaultRGB = {r: 0, g: 0, b: 0}, // for non-supporting envs
            canvas = document.createElement('canvas'),
            context = canvas.getContext && canvas.getContext('2d'),
            data, width, height,
            i = -4,
            length,
            rgb = {r: 0, g: 0, b: 0},
            count = 0;

        if (!context) {
            return defaultRGB;
        }

        height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
        width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

        context.drawImage(imgEl, 0, 0);

        try {
            data = context.getImageData(0, 0, width, height);
        } catch (e) {
            /* security error, img on diff domain */
            return defaultRGB;
        }

        length = data.data.length;

        while ((i += blockSize * 4) < length) {
            ++count;
            rgb.r += data.data[i];
            rgb.g += data.data[i + 1];
            rgb.b += data.data[i + 2];
        }

        // ~~ used to floor values
        rgb.r = ~~(rgb.r / count);
        rgb.g = ~~(rgb.g / count);
        rgb.b = ~~(rgb.b / count);

        return rgb;

    }

    static resize(sourceCanvas: HTMLCanvasElement, width: number, height: number) {

        return new Promise<HTMLCanvasElement>(resolve => {
            const img = new Image();
            img.width = sourceCanvas.width;
            img.height = sourceCanvas.height;
            img.src = sourceCanvas.toDataURL('2d');
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");

                canvas.width = width;
                canvas.height = height;

                context?.drawImage(img, 0, 0, width, height);

                resolve(canvas);
            }
        });
    }


    static openInPopup(src: any) {
        const image = new Image();
        image.src = src;
        image.width = 300;
        image.height = 300;
        const win = window.open("", '_thumbnail', 'popup=true,width=300,height=300');
        if (win) {
            win.document.body.style.margin = '0';
            win.document.body.style.overflow = 'hidden';
            win.document.body.innerHTML = '';
            win.document.body.append(image);
        }
    }
}
