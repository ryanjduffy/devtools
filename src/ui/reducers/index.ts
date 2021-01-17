import { selectors as viewSelectors, reducers as viewReducers } from "pages/view/reducers";

import app, * as appSelectors from "./app";
import metadata, * as metadataSelectors from "./metadata";

export const reducers = {
  app,
  metadata,
  ...viewReducers,
};

export const selectors = {
  ...appSelectors,
  ...metadataSelectors,
  ...viewSelectors,
};
