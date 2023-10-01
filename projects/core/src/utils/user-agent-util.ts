export class UserAgentUtil {
  static getBrowser() {
    let userAgent = navigator.userAgent;

    if (userAgent.indexOf("OPR") > -1) {
      return "Opera";
    } else if (userAgent.indexOf("Edg") > -1) {
      return "Microsoft Edge";
    } else if (userAgent.indexOf("MSIE") > -1) {
      return "Microsoft Internet Explorer";
    } else if (userAgent.indexOf("Chrome") > -1) {
      return "Chrome";
    } else if (userAgent.indexOf("Safari") > -1) {
      return "Safari";
    } else if (userAgent.indexOf("Firefox") > -1) {
      return "Firefox";
    }

    return 'unknown';
  }

  static isMobile() {
    const platform = this.getPlatform();
    return platform == 'IOS' || platform == 'Android' || platform == 'WindowsPhone' || navigator.userAgent.includes('Mobile');
  }

  static getPlatform() {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

    if (/Windows/i.test(userAgent)) {
      return "Windows";
    }

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
      return "WindowsPhone";
    }

    if (/android/i.test(userAgent)) {
      return "Android";
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      return "IOS";
    }

    return "unknown";
  }
}
