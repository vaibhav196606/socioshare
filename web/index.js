import shopifyAppExpress from "@shopify/shopify-app-express";
const { LATEST_API_VERSION, shopifyApp } = shopifyAppExpress;
import { SQLiteSessionStorage } from "@shopify/shopify-app-session-storage-sqlite";
import express from "express";
import { join } from "path";
import { readFileSync } from "fs";
import serveStatic from "serve-static";
import compression from "compression";

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT || "3000", 10);
const isProduction = process.env.NODE_ENV === "production";

// For Railway deployment
const HOST = process.env.HOST || "0.0.0.0";

const shopify = shopifyApp({
  api: {
    apiKey: process.env.SHOPIFY_API_KEY,
    apiSecretKey: process.env.SHOPIFY_API_SECRET,
    scopes: ["read_products"],
    hostName: process.env.SHOPIFY_APP_URL?.replace(/https?:\/\//, "") || "localhost:3000",
    apiVersion: LATEST_API_VERSION,
    restResources: {},
    billing: undefined,
  },
  auth: {
    path: "/api/auth",
    callbackPath: "/api/auth/callback",
  },
  webhooks: {
    path: "/api/webhooks",
  },
  sessionStorage: new SQLiteSessionStorage("database.sqlite"),
});

const app = express();

app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);

// Compliance webhook handlers (GDPR)
const webhookHandlers = {
  CUSTOMERS_DATA_REQUEST: {
    deliveryMethod: "http",
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body) => {
      console.log(`Received ${topic} webhook for ${shop}`);
      // App doesn't store customer data, nothing to return
    },
  },
  CUSTOMERS_REDACT: {
    deliveryMethod: "http",
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body) => {
      console.log(`Received ${topic} webhook for ${shop}`);
      // App doesn't store customer data, nothing to delete
    },
  },
  SHOP_REDACT: {
    deliveryMethod: "http",
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body) => {
      console.log(`Received ${topic} webhook for ${shop}`);
      // App doesn't store shop data, nothing to delete
    },
  },
};

app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers })
);

app.use("/api/*", shopify.validateAuthenticatedSession());
app.use(express.json());

// API endpoints
app.get("/api/products", async (req, res) => {
  try {
    const client = new shopify.api.clients.Rest({
      session: res.locals.shopify.session,
    });
    const data = await client.get({ path: "products" });
    res.status(200).send(data.body);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send({ error: "Failed to fetch products" });
  }
});

app.get("/api/settings", async (req, res) => {
  // Return default settings - in production, store these in a database
  res.status(200).send({
    platforms: ["whatsapp", "facebook", "twitter", "pinterest", "linkedin"],
    buttonStyle: "icon-only",
    buttonSize: "medium",
    buttonColor: "default"
  });
});

app.post("/api/settings", async (req, res) => {
  // Save settings - in production, store these in a database
  const settings = req.body;
  console.log("Settings saved:", settings);
  res.status(200).send({ success: true });
});

// Serve static frontend in production
if (isProduction) {
  const STATIC_PATH = join(process.cwd(), "frontend", "dist");
  app.use(compression());
  app.use(serveStatic(STATIC_PATH, { index: false }));
  
  app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res) => {
    return res
      .status(200)
      .set("Content-Type", "text/html")
      .send(readFileSync(join(STATIC_PATH, "index.html")));
  });
} else {
  app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res) => {
    return res.status(200).send("SocioShare API - Development Mode");
  });
}

app.listen(PORT, HOST, () => {
  console.log(`SocioShare server running on http://${HOST}:${PORT}`);
});
