import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { Auth0Context } from "@auth0/auth0-react";
import { ApolloProvider } from "@apollo/client";

import App from "ui/components/App";
import Auth0ProviderWithHistory from "ui/utils/auth0";
import { createApolloClient } from "ui/utils/apolloClient";

const subscriptions = [];
let args;
export function subscribe(fn) {
  if (args) {
    fn(...args);
  } else {
    subscriptions.push(fn);
  }
}

export async function bootstrapApp(props, context, store) {
  import(/* webpackPrefetch: true */ "../telemetry").then(m => m.init(context));

  args = [store, context];
  subscriptions.forEach(fn => fn(...args));

  ReactDOM.render(
    <Router>
      <Auth0ProviderWithHistory>
        <Auth0Context.Consumer>
          {auth0Client => {
            return (
              <ApolloProvider client={createApolloClient(auth0Client)}>
                <Provider store={store}>{React.createElement(App, props)}</Provider>
              </ApolloProvider>
            );
          }}
        </Auth0Context.Consumer>
      </Auth0ProviderWithHistory>
    </Router>,
    document.querySelector("#app")
  );
}
