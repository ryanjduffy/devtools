import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/apm";

import { isDevelopment, isTest } from "ui/utils/environment";

import { addMiddleware } from "../store";

import { sanityCheckMiddleware } from "./sanitize";
import LogRocket from "./logrocket";

const skipTelemetry = isTest() || isDevelopment();

const authMiddleware = next => action => {
  if (action.type === "register_user" && action.user.sub) {
    LogRocket.identify(action.user.sub, {
      name: action.user.name,
      email: action.user.email,
      id: action.user.id,
    });
  }

  next(action);
};

function setupLogRocket() {
  if (skipTelemetry) {
    if (isDevelopment()) addMiddleware(sanityCheckMiddleware);
    return;
  }

  addMiddleware(LogRocket.reduxMiddleware());
  addMiddleware(authMiddleware);

  LogRocket.init("4sdo4i/replay");
  LogRocket.getSessionURL(sessionURL => {
    Sentry.configureScope(scope => {
      scope.setExtra("sessionURL", sessionURL);
    });
  });
}

function setupSentry(context) {
  const ignoreList = ["Current thread has paused or resumed", "Current thread has changed"];

  if (skipTelemetry) {
    return;
  }

  Sentry.init({
    dsn: "https://41c20dff316f42fea692ef4f0d055261@o437061.ingest.sentry.io/5399075",
    integrations: [new Integrations.Tracing()],
    tracesSampleRate: 1.0,
    beforeSend(event) {
      if (event) {
        const exceptionValue = event?.exception.values[0].value;
        if (ignoreList.some(ignore => exceptionValue.includes(ignore))) {
          return null;
        }
      }

      return event;
    },
  });

  Sentry.setContext("recording", { ...context, url: window.location.href });
}

export function init(context) {
  setupSentry(context);
  setupLogRocket();
}
