export class GoogleUtil {
  static directionTo(latLng: {lat: number, lng: number}) {
    return `https://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=${latLng.lat},${latLng.lng}`
  }
}
