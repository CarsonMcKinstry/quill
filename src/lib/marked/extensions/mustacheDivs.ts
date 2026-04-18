import _ from "lodash";
import { TokenizerAndRendererExtension } from "marked";
import { processStyleTags } from "../utils/processStyleTags";

export const mustacheDivs: TokenizerAndRendererExtension = {
  name: "mustacheDivs",
  level: "block",
  start: (src) => src.match(/\n *{{[^{]/m)?.index,
  tokenizer(src, _tokens) {
    const completeBlock = /^ *{{[^\n}]* *\n.*\n *}}/s; // Regex for the complete token
    const blockRegex =
      /^ *{{(?=((?:[:=](?:"['\w,\-+*/()#%=?.&:!@$^;:[\]_= ]*"|[\w\-()#%.]*)|[^"=':{}\s]*)*))\1 *$|^ *}}$/gm;
    const match = completeBlock.exec(src);

    if (match) {
      //Find closing delimiter
      let blockCount = 0;
      let tags = {};
      let endTags = 0;
      let endToken = 0;
      let delim;
      while ((delim = blockRegex.exec(match[0])?.[0].trim())) {
        if (_.isEmpty(tags)) {
          tags = processStyleTags(delim!.substring(2));
          endTags = delim!.length + src.indexOf(delim!);
        }
        if (delim!.startsWith("{{")) {
          blockCount++;
        } else if (delim == "}}" && blockCount !== 0) {
          blockCount--;
          if (blockCount == 0) {
            endToken = blockRegex.lastIndex;
            break;
          }
        }
      }

      if (endToken) {
        const raw = src.slice(0, endToken);
        const text = raw.slice(endTags || -2, -2);
        return {
          // Token to generate
          type: "mustacheDivs", // Should match "name" above
          raw: raw, // Text to consume from the source
          text: text, // Additional custom properties
          tags: tags,
          tokens: this.lexer.blockTokens(text),
        };
      }
    }
  },
  renderer(token) {
    const tags = token.tags;
    tags.classes = ["block", tags.classes].join(" ").trim();
    return (
      `<div` +
      `${tags.classes ? ` class="${tags.classes}"` : ""}` +
      `${tags.id ? ` id="${tags.id}"` : ""}` +
      `${
        tags.styles
          ? ` style="${Object.entries(tags.styles)
              .map(([key, value]) => `${key}:${value};`)
              .join(" ")}"`
          : ""
      }` +
      `${
        tags.attributes
          ? ` ${Object.entries(tags.attributes)
              .map(([key, value]) => `${key}="${value}"`)
              .join(" ")}`
          : ""
      }` +
      `>${this.parser.parse(token.tokens ?? [])}</div>`
    ); // parse to turn child tokens into HTML
  },
};
