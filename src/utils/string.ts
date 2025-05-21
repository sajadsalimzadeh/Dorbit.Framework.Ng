const numbers: string = '0123456789';
const hex = numbers + 'ABCDEF';
const upperLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowerLetters = 'abcdefghijklmnopqrstuvwxyz';

type Includes = 'number' | 'lower' | 'upper' | 'hex' | 'special';

export class StringUtil {

    static generate(len: number, options: { includes: Includes[] } = {includes: ['lower', 'upper', 'number']}) {
        let str = '';
        if (options.includes.includes('lower')) str += lowerLetters;
        if (options.includes.includes('upper')) str += upperLetters;
        if (options.includes.includes('number')) str += numbers;
        if (options.includes.includes('hex')) str += hex;

        let result = '';
        const charactersLength = str.length;
        for (let i = 0; i < len; i++) {
            result += str.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }

    static parseVersion(version: string, sectionValue = 100) {
        let value = 1;
        let result = 0;
        const sections = version.split('.')
        sections.forEach(x => {
            result += result * value + (+x);
            value *= sectionValue;
        })
        return result;
    }

    static toUint8Array(str: string) {
        const array = new Uint8Array(str.length);
        for (let i = 0; i < str.length; i++) {
            array[i] = str.charCodeAt(i);
        }
        return array;
    }
}
