import React from "react";

type ComponentMatcher = React.ElementType<Props>;

type ComponentAndPropsMatcher = [ComponentMatcher, (props: Props) => boolean];

export type SlotConfig = Record<
  string,
  ComponentMatcher | ComponentAndPropsMatcher
>;

type Props = unknown;

type SlotElements<Config extends SlotConfig> = {
  [Property in keyof Config]: SlotValue<Config, Property>;
};

type SlotValue<
  Config extends SlotConfig, // Added constraint here
  Property extends keyof Config,
> = Config[Property] extends React.ElementType
  ? React.ReactElement<React.ComponentProps<Config[Property]>>
  : Config[Property] extends readonly [infer ElementType, ...unknown[]]
    ? ElementType extends React.ElementType
      ? React.ReactElement<React.ComponentProps<ElementType>>
      : never
    : never;

/**
 * Extract components from `children` so we can render them in different places,
 * allowing us to implement components with SSR-compatible slot APIs.
 * Note: We can only extract direct children, not nested ones.
 */
export function useSlots<Config extends SlotConfig>(
  children: React.ReactNode,
  config: Config,
): [Partial<SlotElements<Config>>, React.ReactNode[]] {
  const slots: Partial<SlotElements<Config>> = mapValues(
    config,
    () => undefined,
  );

  const rest: React.ReactNode[] = [];

  const keys = Object.keys(config) as Array<keyof Config>;
  const values = Object.values(config);

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      rest.push(child);
      return;
    }

    const index = values.findIndex((value) => {
      if (Array.isArray(value)) {
        const [component, testFn] = value;
        return child.type === component && testFn(child.props);
      } else {
        return child.type === value;
      }
    });

    if (index === -1) {
      rest.push(child);
      return;
    }

    const slotKey = keys[index];

    if (slots[slotKey]) {
      console.warn(
        `Found duplicate "${String(
          slotKey,
        )}" slot. Only the first will be rendered.`,
      );
      return;
    }

    slots[slotKey] = child as SlotValue<Config, keyof Config>;
  });

  return [slots, rest];
}

function mapValues<T extends Record<string, unknown>, V>(
  obj: T,
  fn: (value: T[keyof T]) => V,
) {
  return Object.keys(obj).reduce(
    (result, key: keyof T) => {
      result[key] = fn(obj[key]);
      return result;
    },
    {} as Record<keyof T, V>,
  );
}
