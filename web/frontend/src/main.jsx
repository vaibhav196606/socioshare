import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AppProvider } from "@shopify/polaris";
import { Provider as AppBridgeProvider } from "@shopify/app-bridge-react";
import "@shopify/polaris/build/esm/styles.css";
import enTranslations from "@shopify/polaris/locales/en.json";

// Get the host from URL params (Shopify passes this)
const queryParams = new URLSearchParams(window.location.search);
const host = queryParams.get("host");

const config = {
  apiKey: process.env.SHOPIFY_API_KEY || "",
  host: host || "",
  forceRedirect: true,
};

ReactDOM.createRoot(document.getElementById("app")).render(
  <React.StrictMode>
    <AppBridgeProvider config={config}>
      <AppProvider i18n={enTranslations}>
        <App />
      </AppProvider>
    </AppBridgeProvider>
  </React.StrictMode>
);
