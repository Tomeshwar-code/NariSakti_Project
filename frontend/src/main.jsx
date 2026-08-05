import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App";
import store from "./app/store";
import "./theme/index.css";
import "./styles/utilities.css";
import "./styles/layout.css";
import "./styles/responsive.css";
import "./styles/print.css";
import "./styles/components/buttons.css";
import "./styles/components/card.css";
import "./styles/components/forms.css";
import "./styles/components/tables.css";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
