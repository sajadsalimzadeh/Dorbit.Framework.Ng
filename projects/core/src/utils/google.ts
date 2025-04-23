export class GoogleUtil {
    static directionTo(lat: number, lng: number) {
        return `https://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=${lat},${lng}`
    }

    static open(lat: number, lng: number) {
        window.open(`https://www.google.com/maps/place/${lat},${lng}/@${lat},${lng},17z`, '_blank')
    }
}
