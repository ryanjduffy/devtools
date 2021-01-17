import { Action, Store } from "redux";

import * as appActions from "./app";
import * as metadataActions from "./metadata";
import * as sessionActions from "./session";
import { SessionAction } from "./session";
import { ThunkAction } from "ui/utils/thunk";
import { UIState } from "ui/state";
import type { AppAction } from "./app";
import type { MetadataAction } from "./metadata";

import UserProperties from "devtools/client/inspector/rules/models/user-properties";

import devtoolsActions from "pages/view/actions";

export type ReplayAction = AppAction | MetadataAction | SessionAction;

interface ThunkExtraArgs {
  client: any;
  panels: any;
  prefsService: any;
  toolbox: any;
  parser: any;
  search: any;
}

export type UIThunkAction<TReturn = void, TAction extends Action = ReplayAction> = ThunkAction<
  TReturn,
  UIState,
  ThunkExtraArgs,
  TAction
>;

export type UIStore = Store<UIState, ReplayAction> & {
  userProperties?: UserProperties;
};

export const actions = {
  ...appActions,
  ...metadataActions,
  ...sessionActions,
  ...devtoolsActions,
};
