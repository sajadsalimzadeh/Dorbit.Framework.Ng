import {Formatter} from "./formatter";

class Flags {
  tagStartOpen = false;
  tagStartName = false;
  attributeName = false;
  attributeEquals = false;
  attributeQuoteStart = false;
  attributeValue = false;
  attributeQuoteEnd = false;
  tagStartClose = false;
  tagValue = false;
  tagEndOpen = false;
  tagEndName = false;
  tagEndClose = false;

  resetAttributes() {
    this.attributeName = false;
    this.attributeEquals = false;
    this.attributeQuoteStart = false;
    this.attributeValue = false;
    this.attributeQuoteEnd = false;
  }
}

export class HtmlFormatter extends Formatter {
  format(code: string): HTMLElement {
    const span = document.createElement('span');

    const tagStartOpenIndex = code.indexOf('<');
    const tagStartCloseIndex = code.indexOf('>');
    if(tagStartOpenIndex > -1 && tagStartCloseIndex > 1) {
      const tagStart = code.substring(tagStartOpenIndex, tagStartCloseIndex);
      const tagNameMatch = tagStart.match(/<[a-zA-Z0-9\-]+/) ?? [];
      let tagName = (tagNameMatch.length > 0 ? tagNameMatch[0]?.substring(1) : 'tag-name');

      const tagEnd = `</${tagName}>`;
      const tagEndStartIndex = code.lastIndexOf(tagEnd);
      if(tagEndStartIndex > -1) {
        const innerHtml = code.substring(tagStartCloseIndex + 1, tagEndStartIndex - 1);

        this.format(innerHtml)
      } else {

      }
    }
    return span;
  }
}
