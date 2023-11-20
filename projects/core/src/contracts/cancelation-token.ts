export class CancellationToken {
  private _isRequested = false;
  get isRequested(): boolean {
    return this._isRequested;
  }

  cancel() {
    this._isRequested = true;
  }
}
