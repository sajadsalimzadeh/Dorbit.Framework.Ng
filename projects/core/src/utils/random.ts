
const numbers: string = '0123456789';
const hex = numbers + 'ABCDEF';
const upperLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowerLetters = 'abcdefghijklmnopqrstuvwxyz';

type Includes = 'number' | 'lower' | 'upper' | 'hex' | 'special';

export class StringUtil {

  static generate(len: number, options: { includes: Includes[] } = { includes: ['lower', 'upper', 'number']}) {
    let str = '';
    if(options.includes.includes('lower')) str += lowerLetters;
    if(options.includes.includes('upper')) str += upperLetters;
    if(options.includes.includes('number')) str += numbers;
    if(options.includes.includes('hex')) str += hex;

    let result = '';
    const charactersLength = str.length;
    for ( let i = 0; i < len; i++ ) {
      result += str.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }
}
