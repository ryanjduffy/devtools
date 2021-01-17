import * as eventListeners from "devtools/client/debugger/src/actions/event-listeners";
import debuggerActions from "devtools/client/debugger/src/actions";
import { MarkupAction } from "devtools/client/inspector/markup/actions/markup";
import { EventTooltipAction } from "devtools/client/inspector/markup/actions/eventTooltip";
import { SessionAction } from "ui/actions/session";
const consoleActions = require("devtools/client/webconsole/actions");

import { DebuggerAction } from "./debugger";
import timelineActions from "./timeline";
import { TimelineAction } from "./timeline";

export type DevToolsAction =
  | TimelineAction
  | MarkupAction
  | EventTooltipAction
  | SessionAction
  | DebuggerAction;

export const actions = {
  ...eventListeners,
  ...debuggerActions,
  ...consoleActions,
  ...timelineActions,
};

export default actions;
