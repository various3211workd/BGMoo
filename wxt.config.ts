import {defineConfig} from 'wxt';
import react from '@vitejs/plugin-react';

// See https://wxt.dev/api/config.html
export default defineConfig({
    manifest: {
        permissions: ["activeTab", "scripting", "storage", "tabs", "identity"],
        host_permissions: ["http://localhost:8080/*"],
        "content_security_policy": {
            "extension_pages": "script-src 'self' 'wasm-unsafe-eval' http://localhost:3000; object-src 'self'"
        },
        action: {},
        name: '__MSG_extName__',
        description: '__MSG_extDescription__',
        default_locale: "en",
        "web_accessible_resources": [
        {
            "resources": ["audio/*", "audio-samples.json", "success.html", "popup.js"],
            "matches": ["<all_urls>"]
        }
        ]
    },
    vite: () => ({
        plugins: [react()],
    }),
});
