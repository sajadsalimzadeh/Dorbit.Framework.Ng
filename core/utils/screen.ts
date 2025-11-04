export class ScreenUtil {
    static async lockOrientation(orientation: 'landscape' | 'portrait') {
        const screenOrientation = screen.orientation as any;
        if (screenOrientation && typeof screenOrientation.lock == 'function') {
            await screenOrientation.lock(orientation);
        }
    }
}