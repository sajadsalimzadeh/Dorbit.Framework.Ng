export class ColorUtil {
    static rgb2hsl(r: number, g: number, b: number) {
        r /= 255;
        g /= 255;
        b /= 255;
        const l = Math.max(r, g, b);
        const s = l - Math.min(r, g, b);
        const h = s
            ? l === r
                ? (g - b) / s
                : l === g
                    ? 2 + (b - r) / s
                    : 4 + (r - g) / s
            : 0;
        return {
            h: (60 * h < 0 ? 60 * h + 360 : 60 * h),
            s: (100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0)),
            l: ((100 * (2 * l - s)) / 2),
        };
    };
}
