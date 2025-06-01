export class GoogleUtil {
    static directionTo(lat: number, lng: number) {
        return `https://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=${lat},${lng}`
    }

    static getUrl(lat: number, lng: number) {
        return `https://www.google.com/maps/place/${lat},${lng}/@${lat},${lng},17z`;
    }

    static open(lat: number, lng: number) {
        window.open(this.getUrl(lat, lng), '_blank');
    }
}
