export function repeat(times: number, callback: () => void) {
    for (let i = 0; i < times; i++) {
        callback();
    }
}