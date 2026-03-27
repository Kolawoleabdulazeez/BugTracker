import { ComponentType } from "react";

export const RenderComponent = <P extends object>(
  Component: ComponentType<P>,
  props: P
) => {
  return <Component {...props} />;
};
