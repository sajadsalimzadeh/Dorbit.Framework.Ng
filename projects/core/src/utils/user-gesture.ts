export class UserGestureUtil {
  static async run(callback: () => void) {
    return new Promise<void>((resolve, reject) => {
      let func = function () {

        window.removeEventListener('click', func);
        window.removeEventListener('touchend', func);
        try {
          callback();
          resolve();
        } catch (e) {
          reject(e);
          console.error(e)
        }
      };
      window.addEventListener('click', func);
      window.addEventListener('touchend', func);
    })
  }
}
