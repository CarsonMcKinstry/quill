import _ from "lodash";
import { MarkedExtension } from "marked";
import { ExtendedToken, isExtendedToken } from "../types";
import { extractHTMLStyleTags } from "../utils/extractHTMLStyleTags";
import { mergeHTMLTags } from "../utils/mergeHTMLTags";
import { processStyleTags } from "../utils/processStyleTags";

export const mustacheInjectBlock: MarkedExtension = {
  extensions: [
    {
      name: "mustacheInjectBlock",
      level: "block",
      start: (src) => src.match(/\n *{[^{\n]/m)?.index,
      tokenizer(src, tokens) {
        const inlineRegex =
          /^ *{(?=((?:[:=](?:"['\w,\-+*/()#%=?.&:!@$^;:[\]_= ]*"|[\w\-+*/()#%.]*)|[^"=':{}\s]*)*))\1}/my;
        const match = inlineRegex.exec(src);

        if (match) {
          const lastToken = tokens.at(-1) as ExtendedToken;

          if (!lastToken || lastToken.type == "mustacheInjectBlock") return;

          lastToken.originalType = "mustacheInjectBlock";
          lastToken.injectedTags = processStyleTags(match[1]);

          return {
            type: "mustacheInjectBlock",
            raw: "",
            text: "",
          };
        }
      },
      renderer(token) {
        if (isExtendedToken(token)) {
          if (!token.originalType) return;

          token.type = token.originalType;

          const text = this.parser.parse([token]);
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
        }

        return false;
      },
    },
  ],
  walkTokens(token) {
    if (isExtendedToken(token)) {
      if (
        token.originalType == "mustacheInjectBlock" &&
        token.type !== "table"
      ) {
        token.originalType = token.type;
        token.type = "mustacheInjectBlock";
      }
    }
  },
};
