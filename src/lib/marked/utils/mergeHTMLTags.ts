import { InjectedTags } from "../types";

export const mergeHTMLTags = (
  originalTags: InjectedTags,
  newTags: InjectedTags,
): InjectedTags => ({
  id: newTags.id ?? originalTags.id ?? null,
  classes: [originalTags.classes, newTags.classes].join(" ").trim(),
  styles: Object.assign(originalTags.styles ?? {}, newTags.styles ?? {}),
  attributes: Object.assign(
    originalTags.attributes ?? {},
    newTags.attributes ?? {},
  ),
});
