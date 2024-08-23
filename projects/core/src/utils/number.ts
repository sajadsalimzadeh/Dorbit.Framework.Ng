export class NumberUtil {
  static round(n: number, precision: number = 0) {
    const coefficient = Math.pow(10, precision);
    return Math.round(n * coefficient) / coefficient;
  }

  static format(n: number | undefined | null, precision: number = 0) {
    if (typeof n === 'number') return this.round(n, precision).toLocaleString('en-US');
    return '';
  }

  static toTime(totalSec: number, format: 'sec' | 'min' | 'hour' = 'min', pad = 5) {
    if (totalSec < 0) totalSec = 0;
    if (format == 'sec') return totalSec.toString().padStart(pad, '0');

    const min = Math.floor(totalSec / 60);
    const sec = Math.floor(totalSec % 60);
    if (format == 'min') {
      return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    }
    const hour = Math.floor(totalSec / 3600);
    return `${hour.toString().padStart(2, '0')}:${Math.floor(min % 60).toString().padStart(2, '0')}:${Math.floor(totalSec % 60).toString().padStart(2, '0')}`;
  }

  static parseHex(hex: string | undefined) {
    if(!hex) return '';
    return parseInt(hex, 16);
  }
}
