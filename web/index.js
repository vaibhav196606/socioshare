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

// Server always binds to 0.0.0.0 for Railway
const SERVER_HOST = "0.0.0.0";

// Shopify app URL (without protocol)
const SHOPIFY_HOST = process.env.HOST?.replace(/https?:\/\//, "") || 
                     process.env.RAILWAY_PUBLIC_DOMAIN || 
                     "localhost:3000";

const shopify = shopifyApp({
  api: {
    apiKey: process.env.SHOPIFY_API_KEY,
    apiSecretKey: process.env.SHOPIFY_API_SECRET,
    scopes: process.env.SCOPES?.split(",") || ["read_products"],
    hostName: SHOPIFY_HOST,
    apiVersion: LATEST_API_VERSION,
    isEmbeddedApp: true,
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

// Webhook handlers for GDPR compliance
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ 
    webhookHandlers: {
      CUSTOMERS_DATA_REQUEST: async (topic, shop, body, webhookId) => {
        console.log(`GDPR webhook: ${topic} from ${shop}`);
        // App doesn't store customer data
      },
      CUSTOMERS_REDACT: async (topic, shop, body, webhookId) => {
        console.log(`GDPR webhook: ${topic} from ${shop}`);
        // App doesn't store customer data
      },
      SHOP_REDACT: async (topic, shop, body, webhookId) => {
        console.log(`GDPR webhook: ${topic} from ${shop}`);
        // App doesn't store shop data
      },
    }
  })
);

app.use(express.json());
app.use("/api/*", shopify.validateAuthenticatedSession());

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

app.listen(PORT, SERVER_HOST, () => {
  console.log(`SocioShare server running on http://${SERVER_HOST}:${PORT}`);
  console.log(`Shopify app configured for: ${SHOPIFY_HOST}`);
});
