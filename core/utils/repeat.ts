export function repeat<T = void>(times: number, callback: (index: number) => T) {
    const result: T[] = [];
    for (let i = 0; i < times; i++) {
        result.push(callback(i));
    }
    return result;
}