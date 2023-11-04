export class MobileUtil {

  private static openApp(args: any[], body?: string) {
    const ua = window.navigator.userAgent.toLowerCase();
    if (ua.includes('iphone') || ua.includes('android')) {
      const ch = (ua.includes('iphone') ? '&' : '?');
      location.href = `sms://${args.join('/')}${body ? '/' + ch + 'body=' + encodeURIComponent(body) : ''}`;
      return true;
    }
    return false;
  }

  static sms(number: string, text: string) {
    return this.openApp([number], text);
  }

  static call(number: string) {
    return this.openApp([number]);
  }
}
