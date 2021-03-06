import { initSocket } from "protocol/socket";
import { setupLogpoints } from "./protocol/logpoint";
import { bootstrapStore } from "ui/utils/bootstrap/bootstrapStore";
import { actions } from "ui/actions";
const { setupTimeline, setupApp, setModal } = actions;
import { setupGraphics } from "protocol/graphics";
import { updateEnableRepaint } from "protocol/enable-repaint";
const { setupMessages } = require("devtools/client/webconsole/actions/messages");

const { LocalizationHelper } = require("devtools/shared/l10n");
import { setupEventListeners } from "devtools/client/debugger/src/actions/event-listeners";
import { DevToolsToolbox } from "ui/utils/devtools-toolbox";
import { createSession } from "ui/actions/session";
const {
  initOutputSyntaxHighlighting,
} = require("./devtools/client/webconsole/utils/syntax-highlighted");
const { setupExceptions } = require("devtools/client/debugger/src/actions/logExceptions");
import { selectors } from "ui/reducers";
import { getUserSettings } from "ui/hooks/settings";
import DevTools from "ui/components/DevTools";

const url = new URL(window.location.href);
const recordingId = url.searchParams.get("id")!;
const dispatch = url.searchParams.get("dispatch") || undefined;

declare global {
  const gToolbox: DevToolsToolbox;
  interface Window {
    L10N: any;
    gToolbox: DevToolsToolbox;
    store: any;
    mouseClientX?: number;
    mouseClientY?: number;
  }
}

export async function initialize() {
  window.gToolbox = new DevToolsToolbox();
  const store = await bootstrapStore();
  window.store = store;

  window.L10N = new LocalizationHelper("devtools/client/locales/debugger.properties");

  // Initialize the socket so we can communicate with the server
  initSocket(store, dispatch);
  createSession(store, recordingId);

  document.body.addEventListener("contextmenu", e => e.preventDefault());

  // Set the current mouse position on the window. This is used in places where
  // testing element.matches(":hover") does not work right for some reason.
  document.body.addEventListener("mousemove", e => {
    window.mouseClientX = e.clientX;
    window.mouseClientY = e.clientY;
  });
  window.elementIsHovered = elem => {
    if (!elem) {
      return false;
    }
    const { left, top, right, bottom } = elem.getBoundingClientRect();
    const { mouseClientX, mouseClientY } = window;
    return (
      left <= mouseClientX! &&
      mouseClientX! <= right &&
      top <= mouseClientY! &&
      mouseClientY! <= bottom
    );
  };

  const theme = selectors.getTheme(store.getState());
  document.body.parentElement!.className = theme || "";

  if (url.searchParams.has("settings")) {
    store.dispatch(setModal("settings"));
  }

  setupApp(recordingId, store);
  setupTimeline(recordingId, store);
  setupEventListeners(recordingId, store);
  setupGraphics(store);
  initOutputSyntaxHighlighting();
  setupMessages(store);
  setupLogpoints(store);
  setupExceptions(store);

  const settings = await getUserSettings();
  updateEnableRepaint(settings.enableRepaint);

  return { store, Page: DevTools };
}
