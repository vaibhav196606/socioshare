import { useState, useCallback } from "react";
import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Checkbox,
  Select,
  Button,
  Banner,
  Icon,
  Box,
} from "@shopify/polaris";
import {
  ShareIcon,
  SettingsIcon,
} from "@shopify/polaris-icons";

const SOCIAL_PLATFORMS = [
  { id: "whatsapp", label: "WhatsApp", color: "#25D366" },
  { id: "facebook", label: "Facebook", color: "#1877F2" },
  { id: "twitter", label: "Twitter/X", color: "#000000" },
  { id: "pinterest", label: "Pinterest", color: "#BD081C" },
  { id: "linkedin", label: "LinkedIn", color: "#0A66C2" },
  { id: "instagram", label: "Instagram", color: "#E4405F" },
];

const BUTTON_STYLES = [
  { value: "icon-only", label: "Icon Only" },
  { value: "icon-text", label: "Icon with Text" },
  { value: "text-only", label: "Text Only" },
];

const BUTTON_SIZES = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];

export default function App() {
  const [selectedPlatforms, setSelectedPlatforms] = useState([
    "whatsapp",
    "facebook",
    "twitter",
    "pinterest",
    "linkedin",
  ]);
  const [buttonStyle, setButtonStyle] = useState("icon-only");
  const [buttonSize, setButtonSize] = useState("medium");
  const [saved, setSaved] = useState(false);

  const handlePlatformChange = useCallback(
    (platformId) => {
      setSelectedPlatforms((prev) =>
        prev.includes(platformId)
          ? prev.filter((id) => id !== platformId)
          : [...prev, platformId]
      );
      setSaved(false);
    },
    []
  );

  const handleSave = useCallback(async () => {
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platforms: selectedPlatforms,
          buttonStyle,
          buttonSize,
        }),
      });
      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  }, [selectedPlatforms, buttonStyle, buttonSize]);

  return (
    <Page
      title="SocioShare"
      subtitle="Add social media sharing buttons to your products"
      primaryAction={{
        content: "Save Settings",
        onAction: handleSave,
      }}
    >
      <Layout>
        {saved && (
          <Layout.Section>
            <Banner
              title="Settings saved successfully!"
              tone="success"
              onDismiss={() => setSaved(false)}
            />
          </Layout.Section>
        )}

        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <InlineStack align="start" gap="200">
                <Icon source={ShareIcon} tone="base" />
                <Text as="h2" variant="headingMd">
                  Social Platforms
                </Text>
              </InlineStack>
              <Text as="p" tone="subdued">
                Select which social media platforms to show sharing buttons for
              </Text>
              <BlockStack gap="300">
                {SOCIAL_PLATFORMS.map((platform) => (
                  <Checkbox
                    key={platform.id}
                    label={
                      <InlineStack gap="200" align="center">
                        <Box
                          background="bg-fill"
                          borderRadius="100"
                          padding="100"
                          style={{ backgroundColor: platform.color }}
                        >
                          <div
                            style={{
                              width: "16px",
                              height: "16px",
                              borderRadius: "50%",
                            }}
                          />
                        </Box>
                        <Text>{platform.label}</Text>
                      </InlineStack>
                    }
                    checked={selectedPlatforms.includes(platform.id)}
                    onChange={() => handlePlatformChange(platform.id)}
                  />
                ))}
              </BlockStack>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section secondary>
          <Card>
            <BlockStack gap="400">
              <InlineStack align="start" gap="200">
                <Icon source={SettingsIcon} tone="base" />
                <Text as="h2" variant="headingMd">
                  Button Appearance
                </Text>
              </InlineStack>
              <Select
                label="Button Style"
                options={BUTTON_STYLES}
                value={buttonStyle}
                onChange={(value) => {
                  setButtonStyle(value);
                  setSaved(false);
                }}
              />
              <Select
                label="Button Size"
                options={BUTTON_SIZES}
                value={buttonSize}
                onChange={(value) => {
                  setButtonSize(value);
                  setSaved(false);
                }}
              />
            </BlockStack>
          </Card>

          <div style={{ marginTop: "16px" }}>
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Installation
                </Text>
                <Text as="p" tone="subdued">
                  To add sharing buttons to your store:
                </Text>
                <BlockStack gap="200">
                  <Text as="p">
                    1. Go to <strong>Online Store → Themes</strong>
                  </Text>
                  <Text as="p">
                    2. Click <strong>Customize</strong> on your theme
                  </Text>
                  <Text as="p">
                    3. Navigate to a product page
                  </Text>
                  <Text as="p">
                    4. Click <strong>Add block</strong> and select{" "}
                    <strong>SocioShare Buttons</strong>
                  </Text>
                </BlockStack>
              </BlockStack>
            </Card>
          </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
