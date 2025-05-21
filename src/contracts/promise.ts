export interface PromiseAction<T> {
    resolve: (value: T) => void;
    reject: (cause?: any) => void;
}
