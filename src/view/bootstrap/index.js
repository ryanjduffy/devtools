import * as dbgClient from "devtools/client/debugger/src/client";
import { addMiddleware } from "shared/store";

import { context } from "./context";

function bootstrap(store) {
  addMiddleware(context);
  dbgClient.bootstrap(store);
}

export { bootstrap };
