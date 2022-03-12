import { StrictMode } from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import Root from "./Root";
import "./index.css";

ReactDOM.render(
  <StrictMode>
    <title>
      {`bitcoin-dva.io${
        process.env.NODE_ENV === "development" ? " - DEV " : ""
      }`}
    </title>
    <Root />
  </StrictMode>,
  document.getElementById("root")
);

serviceWorker.unregister();
