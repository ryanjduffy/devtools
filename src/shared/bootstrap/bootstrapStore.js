// const { getPrefsService } = require("devtools/client/webconsole/utils/prefs");
// const { getConsoleInitialState } = require("devtools/client/webconsole/store");
// import * as dbgClient from "devtools/client/debugger/src/client";

import { isDevelopment, isTest } from "ui/utils/environment";
import { prefs, asyncStore } from "ui/utils/prefs";
import { reducers, selectors } from "ui/reducers";

import { configureStore } from "../store";

import { setupAppHelper } from "./helpers";

const skipTelemetry = isTest() || isDevelopment();

async function getInitialState() {
  const eventListenerBreakpoints = await asyncStore.eventListenerBreakpoints;
  // const initialDebuggerState = await dbgClient.loadInitialState();
  // const initialConsoleState = getConsoleInitialState();

  return {
    // ...initialDebuggerState,
    eventListenerBreakpoints,
    // ...initialConsoleState,
  };
}

function registerStoreObserver(store, subscriber) {
  let oldState = store.getState();
  store.subscribe(() => {
    const state = store.getState();
    subscriber(state, oldState);
    oldState = state;
  });
}

function updatePrefs(state, oldState) {
  function updatePref(field, selector) {
    if (selector(state) != selector(oldState)) {
      prefs[field] = selector(state);
    }
  }
  function updateAsyncPref(field, selector) {
    if (selector(state) != selector(oldState)) {
      asyncStore[field] = selector(state);
    }
  }

  updatePref("viewMode", selectors.getViewMode);
  updatePref("splitConsole", selectors.isSplitConsoleOpen);
  updatePref("user", selectors.getUser);
  updatePref("selectedPanel", selectors.getSelectedPanel);
  updateAsyncPref("eventListenerBreakpoints", state => state.eventListenerBreakpoints);
}

export const bootstrapStore = async function bootstrapStore() {
  // TODO; manage panels outside of the Toolbox componenet
  const panels = {};
  const initialState = await getInitialState();
  // const prefsService = getPrefsService();

  const store = configureStore(reducers, initialState, null, {
    makeThunkArgs: args => {
      return {
        ...args,
        panels,
        // prefsService,
      };
    },
  });

  registerStoreObserver(store, updatePrefs);

  setupAppHelper(store);

  return store;
};
