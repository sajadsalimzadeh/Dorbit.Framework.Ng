export function delay(duration: number) {
    return new Promise<void>(resolve => setTimeout(() => resolve(), duration));
}

let timer: any;

export function debounce(callback: () => void, duration: number) {
    clearTimeout(timer);
    timer = setTimeout(() => {
        callback();
    }, duration)
}
