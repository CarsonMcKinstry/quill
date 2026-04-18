import _ from "lodash";
import { InjectedTags } from "../types";
import { buildAttributeObject } from "./buildAttributeObject";
import { buildStyleObject } from "./buildStyleObject";

export const processStyleTags = (string: string): InjectedTags => {
  //split tags up. quotes can only occur right after : or =.
  //TODO: can we simplify to just split on commas?
  const tags = [...(string.match(/(?:[^, ":=]+|[:=](?:"[^"]*"|))+/g) ?? [])];

  const id =
    _.remove(tags, (tag) => tag.startsWith("#")).map((tag) =>
      tag.slice(1),
    )[0] || null;
  const classes =
    _.remove(tags, (tag) => !tag.includes(":") && !tag.includes("=")).join(
      " ",
    ) || null;
  const attributes =
    _.remove(tags, (tag) => tag.includes("="))
      .map((tag) => tag.replace(/="?([^"]*)"?/g, '="$1"'))
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
  const styles = tags?.length
    ? tags.reduce(
        buildStyleObject((value) => value.replace(/"?([^"]*)"?/g, "$1")),
        {},
      )
    : null;

  return {
    id: id,
    classes: classes,
    styles: _.isEmpty(styles) ? null : styles,
    attributes: _.isEmpty(attributes) ? null : attributes,
  };
};
