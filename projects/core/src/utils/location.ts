export class LocationUtil {
  static distance(p1: {lat: number, lng: number}, p2: {lat: number, lng: number}) {
    const R = 6371; // شعاع زمین بر حسب کیلومتر (برای مایل از 3958 استفاده کنید)

    // تبدیل درجه به رادیان
    const toRad = (value: number) => (value * Math.PI) / 180;

    const dLat = toRad(p2.lat - p1.lat);
    const dLon = toRad(p2.lng - p1.lng);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(p1.lat)) * Math.cos(toRad(p2.lat)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c * 1000;
  }
}
