export class UserGestureUtil {
  static async run(callback: () => Promise<void>) {
    return new Promise<void>((resolve, reject) => {
      let func = async function () {

        window.removeEventListener('click', func);
        window.removeEventListener('touchend', func);
        try {
          await callback();
          resolve();
        } catch (e) {
          reject(e);
          console.error()
        }
      };
      window.addEventListener('click', func);
      window.addEventListener('touchend', func);
    })
  }
}
