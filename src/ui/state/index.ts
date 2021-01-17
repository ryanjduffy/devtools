import { MetadataState } from "./metadata";
import { AppState } from "./app";

import { DevToolsState } from "pages/view/state";

export interface UIState extends DevToolsState {
  metadata: MetadataState;
  app: AppState;
}
