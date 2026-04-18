import _ from "lodash";
import { TokenizerAndRendererExtension } from "marked";
import { ExtendedToken } from "../types";
import { extractHTMLStyleTags } from "../utils/extractHTMLStyleTags";
import { mergeHTMLTags } from "../utils/mergeHTMLTags";
import { processStyleTags } from "../utils/processStyleTags";

export const mustacheInjectInline: TokenizerAndRendererExtension = {
  name: "mustacheInjectInline",
  level: "inline",
  start(src) {
    return src.match(/ *{[^{\n]/)?.index;
  }, // Hint to Marked.js to stop and check for a match
  tokenizer(src, tokens) {
    const inlineRegex =
      /^ *{(?=((?:[:=](?:"['\w,\-+*/()#%=?.&:!@$^;:[\]_= ]*"|[\w\-()#%.]*)|[^"=':{}\s]*)*))\1}/g;
    const match = inlineRegex.exec(src);
    if (match) {
      const lastToken = tokens[tokens.length - 1] as ExtendedToken;
      if (!lastToken || lastToken.type == "mustacheInjectInline") return;

      const tags = processStyleTags(match[1]);
      lastToken.originalType = lastToken.type;
      lastToken.type = "mustacheInjectInline";
      lastToken.injectedTags = tags;
      return {
        type: "mustacheInjectInline", // Should match "name" above
        raw: match[0], // Text to consume from the source
        text: "",
      };
    }
  },
  renderer(token) {
    if (!token.originalType) {
      return;
    }
    token.type = token.originalType;
    const text = this.parser.parseInline([token]);
    const originalTags = extractHTMLStyleTags(text);
    const injectedTags = token.injectedTags;
    const tags = mergeHTMLTags(originalTags, injectedTags);
    const openingTag = /(<[^\s<>]+)[^\n<>]*(>.*)/s.exec(text);
    if (openingTag) {
      return (
        `${openingTag[1]}` +
        `${tags.classes ? ` class="${tags.classes}"` : ""}` +
        `${tags.id ? ` id="${tags.id}"` : ""}` +
        `${
          !_.isEmpty(tags.styles)
            ? ` style="${Object.entries(tags.styles)
                .map(([key, value]) => `${key}:${value};`)
                .join(" ")}"`
            : ""
        }` +
        `${
          !_.isEmpty(tags.attributes)
            ? ` ${Object.entries(tags.attributes)
                .map(([key, value]) => `${key}="${value}"`)
                .join(" ")}`
            : ""
        }` +
        `${openingTag[2]}`
      ); // parse to turn child tokens into HTML
    }
    return text;
  },
};
