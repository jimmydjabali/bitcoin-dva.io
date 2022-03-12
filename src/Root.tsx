import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { BrowserRouter } from "react-router-dom";
import { App } from "./app";

library.add(fas);

const Root = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default Root;
