import './platform.js';

declare const platform: {
  description: string;
  layout: string;
  name: string;
  os: {
    architecture: number;
    family: string;
    version: string;
  };
  ua: string;
  version: string;
  major: number;
  minor: number;
  patch: number;
  build: number;
};

export class UserAgentUtil {
  static getBrowserName() {
    let userAgent = navigator.userAgent;

    if (userAgent.indexOf("OPR") > -1) {
      return "Opera";
    } else if (userAgent.indexOf("Edg") > -1) {
      return "Edge";
    } else if (userAgent.indexOf("MSIE") > -1) {
      return "IE";
    } else if (userAgent.indexOf("Chrome") > -1) {
      return "Chrome";
    } else if (userAgent.indexOf("Safari") > -1) {
      return "Safari";
    } else if (userAgent.indexOf("Firefox") > -1) {
      return "Firefox";
    }

    return 'unknown';
  }

  static getBrowser() {
    const versions = platform.version?.split('.') ?? [];
    if(versions.length > 0) platform.major = +versions[0];
    if(versions.length > 1) platform.minor = +versions[1];
    if(versions.length > 2) platform.patch = +versions[2];
    if(versions.length > 3) platform.build = +versions[3];
    return platform;
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
