import * as React from "react";

declare module "react" {
  /*
  Old typedefs from before React shipped them.
  todo: remove them and fix our usage.

  React typedefs requires the second argument (cache keys), so we'll
  need to fix all our call sites. Interestingly, the React docs suggest
  it's syntactically okay to leave it out:

  > If no array is provided, a new value will be computed on every render.

  ( https://reactjs.org/docs/hooks-reference.html#usememo )

   */
  function useEffect(
    f: () => void | Promise<void> | (() => void | Promise<void>),
    keys?: any[]
  ): void;
  function useCallback<Callback extends Function, R>(
    f: Callback,
    keys?: any[]
  ): Callback;
}

module "react-dom/test-utils" {
  /*
  This is for [async act()](https://github.com/facebook/react/pull/14853).
  todo: remove this after React 16.9
  */
  function act(callback: () => Promise): DebugPromiseLike | {};
}
