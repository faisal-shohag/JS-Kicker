import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  srcDir: "src",
  outDir: "dist",

  manifest: () => {
    return {
      name: "PH Js Kicker",
      version: "2.0.0",
      description: "Javascript Assignment Kicker for PH Instructors. Made with ❤️ by Abu Nayim Faisal.",
      permissions: [
        "storage",
        "scripting",
        "tabs",
        "webNavigation",
        "activeTab",
        "contextMenus",
        "declarativeNetRequest",
      ],

      content_security_policy: {
        extension_pages: "script-src 'self'; object-src 'self';",
      },
    };
  },
});
