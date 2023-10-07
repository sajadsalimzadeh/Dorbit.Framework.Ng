export function setCounter(duration: number, callback?: (c: number) => void) {
  return new Promise<void>(resolve => {
    const interval = setInterval(() => {
      if (duration > 0) {
        duration--;
        if (callback) callback(duration);
      } else {
        clearInterval(interval);
        resolve();
      }
    }, 1000);
  });
}
