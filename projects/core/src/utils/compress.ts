export class Compressor {
  static compress(str: string) {
    let i,
      dictionary: any = {},
      uncompressed = str,
      c,
      wc,
      w = "",
      result = [],
      ASCII = '',
      dictSize = 256;
    for (i = 0; i < 256; i += 1) {
      dictionary[String.fromCharCode(i)] = i;
    }

    for (i = 0; i < uncompressed.length; i += 1) {
      c = uncompressed.charAt(i);
      wc = w + c;
      //Do not use dictionary[wc] because javascript arrays
      //will return values for array['pop'], array['push'] etc
      // if (dictionary[wc]) {
      if (dictionary.hasOwnProperty(wc)) {
        w = wc;
      } else {
        result.push(dictionary[w]);
        ASCII += String.fromCharCode(dictionary[w]);
        // Add wc to the dictionary.
        dictionary[wc] = dictSize++;
        w = String(c);
      }
    }

    // Output the code for w.
    if (w !== "") {
      result.push(dictionary[w]);
      ASCII += String.fromCharCode(dictionary[w]);
    }
    return ASCII;
  }
  static decompress(str: string) {
    let i, tmp = [],
      dictionary = [],
      compressed = str,
      compressArray = [],
      w,
      result,
      k,
      entry = "",
      dictSize = 256;
    for (i = 0; i < 256; i += 1) {
      dictionary[i] = String.fromCharCode(i);
    }

    if(compressed) {
      // convert string into Array.
      for(i = 0; i < compressed.length; i += 1) {
        compressArray.push(compressed[i].charCodeAt(0));
      }
    }

    w = String.fromCharCode(compressArray[0]);
    result = w;
    for (i = 1; i < compressArray.length; i += 1) {
      k = compressArray[i];
      if (dictionary[k]) {
        entry = dictionary[k];
      } else {
        if (k === dictSize) {
          entry = w + w.charAt(0);
        } else {
          return null;
        }
      }

      result += entry;

      // Add w+entry[0] to the dictionary.
      dictionary[dictSize++] = w + entry.charAt(0);

      w = entry;
    }
    return result;
  }
}
