import { TokenizerAndRendererExtension } from "marked";

export const forcedParagraphBreaks: TokenizerAndRendererExtension = {
  name: "hardBreaks",
  level: "block",
  start: (src) => src.match(/\n:+$/m)?.index,
  tokenizer: (src, _tokens) => {
    const regex = /^(:+)(?:\n|$)/my;
    const match = regex.exec(src);
    if (match?.length) {
      return {
        type: "hardBreaks", // Should match "name" above
        raw: match[0], // Text to consume from the source
        length: match[1].length,
        text: "",
      };
    }
  },
  renderer: (token) => `<div class='blank'></div>\n`.repeat(token.length),
};
