import _ from "lodash";
import { InjectedTags } from "../types";
import { buildAttributeObject } from "./buildAttributeObject";
import { buildStyleObject } from "./buildStyleObject";

export const extractHTMLStyleTags = (htmlString: string): InjectedTags => {
  const firstElementOnly = htmlString.split(">")[0];
  const id = firstElementOnly.match(/id="([^"]*)"/)?.[1] || null;
  const classes = firstElementOnly.match(/class="([^"]*)"/)?.[1] || null;
  const styles =
    firstElementOnly
      .match(/style="([^"]*)"/)?.[1]
      ?.split(";")
      .reduce(buildStyleObject(), {}) || null;
  const attributes =
    firstElementOnly
      .match(/[a-zA-Z]+="[^"]*"/g)
      ?.filter(
        (attr) =>
          !attr.startsWith('class="') &&
          !attr.startsWith('style="') &&
          !attr.startsWith('id="'),
      )
      .reduce(
        buildAttributeObject((value) => value.replace(/"/g, "")),
        {},
      ) || null;

  return {
    id: id,
    classes: classes,
    styles: _.isEmpty(styles) ? null : styles,
    attributes: _.isEmpty(attributes) ? null : attributes,
  };
};
