import { combineReducers } from "redux";

const state = {
  reducer: null,
  store: null,
};

function initReducer(reducer) {
  state.reducer = state.reducer
    ? combineReducers(state.reducer, reducer)
    : combineReducers(reducer);

  return state.reducer;
}

function appendReducers(reducers) {
  combine(reducers);
  if (state.store) {
    state.store.replaceReducer(state.reducer);
  }
}

function getReducer() {
  return state.reducer;
}

function initStore(store) {
  state.store = store;

  return state.store;
}

export { appendReducers, getReducer, initReducer, initStore };
