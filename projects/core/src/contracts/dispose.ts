export interface IDisposable {
    dispose(): Promise<void>;
}

export async function using(action: () => Promise<IDisposable>) {
    const disposable = await action();
    await disposable.dispose();
}
