import * as dbgClient from "devtools/client/debugger/src/client";
import { bootstrapWorkers } from "devtools/client/debugger/src/utils/bootstrap";
import { clientCommands } from "devtools/client/debugger/src/client/commands";

const { DevToolsToolbox } = require("ui/utils/devtools-toolbox");

import { addMiddleware, addThunkEnhancer } from "shared/store";

import { context } from "./context";

function bootstrap(store) {
  const debuggerWorkers = bootstrapWorkers();
  window.gToolbox = new DevToolsToolbox();

  addMiddleware(context);
  addThunkEnhancer(args => ({
    ...args,
    ...debuggerWorkers,
    client: clientCommands,
    toolbox: gToolbox,
  }));
  dbgClient.bootstrap(store);
}

export { bootstrap };
