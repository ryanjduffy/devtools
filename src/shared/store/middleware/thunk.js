/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

//

const enhancers = [];
const enhance = args => enhancers.reduce((acc, fn) => fn(acc), args);

export function addThunkEnhancer(fn) {
  if (!enhancers.includes(fn)) {
    enhancers.push(fn);
  }
}

/**
 * A middleware that allows thunks (functions) to be dispatched. If
 * it's a thunk, it is called with an argument that contains
 * `dispatch`, `getState`, and any additional args passed in via the
 * middleware constructure. This allows the action to create multiple
 * actions (most likely asynchronously).
 */
export function thunk(enhancer) {
  addThunkEnhancer(enhancer);
  return ({ dispatch, getState }) => {
    const args = { dispatch, getState };

    return next => action => {
      return typeof action === "function" ? action(enhance(args)) : next(action);
    };
  };
}
