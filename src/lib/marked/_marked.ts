import { marked as Marked } from "marked";

import MarkedAlignedParagraphs from "marked-alignment-paragraphs";
import MarkedDefinitionLists from "marked-definition-lists";
import { markedEmoji as MarkedEmojis } from "marked-emoji";
import MarkedExtendedTables from "marked-extended-tables";
import { gfmHeadingId as MarkedGFMHeadingId } from "marked-gfm-heading-id";
import MarkedNonbreakingSpaces from "marked-nonbreaking-spaces";
import { markedSmartypantsLite as MarkedSmartypantsLite } from "marked-smartypants-lite";
import MarkedSubSuperText from "marked-subsuper-text";
import { markedVariables } from "marked-variables";

import { forcedParagraphBreaks } from "./extensions/forcedParagraphBreaks";
import { mustacheDivs } from "./extensions/mustacheDivs";
import { mustacheInjectBlock } from "./extensions/mustacheInjectBlock";
import { mustacheInjectInline } from "./extensions/mustacheInjectInline";
import { mustacheSpans } from "./extensions/mustacheSpans";

const renderer = new Marked.Renderer();
const tokenizer = new Marked.Tokenizer();

Marked.use(markedVariables());
Marked.use(MarkedDefinitionLists());

Marked.use(MarkedAlignedParagraphs());
Marked.use(MarkedSubSuperText());
Marked.use(MarkedNonbreakingSpaces());
Marked.use({ renderer: renderer, tokenizer });

Marked.use(mustacheInjectBlock);

Marked.use({
  extensions: [
    forcedParagraphBreaks,
    mustacheSpans,
    mustacheDivs,
    mustacheInjectInline,
  ],
});

Marked.use(
  MarkedExtendedTables({
    interruptPatterns: [
      `:+\\n`, // hardBreak
      ` *{[^\n]+}`, // blockInjector
      ` *{{[^{\n]*\n.*?\n}}`, // mustacheDiv
    ],
  }),
  MarkedGFMHeadingId(),
  MarkedSmartypantsLite(),
  MarkedEmojis({
    emojis: {
      // ...diceFont,
      // ...elderberryInn,
      // ...fontAwesome,
      // ...gameIcons,
    },
    renderer: (token) => `<i class="${token.emoji}"></i>`,
  }),
);

export { Marked };
