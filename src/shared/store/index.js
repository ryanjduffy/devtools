/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

//

/* global window */

/**
 * Redux store utils
 * @module utils/create-store
 */

import { createStore, applyMiddleware } from "redux";
import dynamicMiddlewares, { addMiddleware, removeMiddleware } from "redux-dynamic-middlewares";

import { promise } from "./middleware/promise";
import { addThunkEnhancer, thunk } from "./middleware/thunk";

import { appendReducers, initReducer, initStore } from "./reducers";

/**
 * @memberof utils/create-store
 * @static
 */

/**
 * This creates a dispatcher with all the standard middleware in place
 * that all code requires. It can also be optionally configured in
 * various ways, such as logging and recording.
 *
 * @param {object} opts:
 *        - log: log all dispatched actions to console
 *        - history: an array to store every action in. Should only be
 *                   used in tests.
 *        - middleware: array of middleware to be included in the redux store
 * @memberof utils/create-store
 * @static
 */
const configureStore = (reducer, initialState, middleware, opts = {}) => {
  middleware = [thunk(opts.makeThunkArgs), promise, dynamicMiddlewares, middleware].filter(Boolean);

  // Hook in the redux devtools browser extension if it exists
  const devtoolsExt =
    typeof window === "object" && window.devToolsExtension ? window.devToolsExtension() : f => f;

  const _createStore = devtoolsExt(createStore);
  return initStore(
    _createStore(initReducer(reducer), initialState, applyMiddleware(...middleware))
  );
};

export { addThunkEnhancer, appendReducers, configureStore, addMiddleware, removeMiddleware };
