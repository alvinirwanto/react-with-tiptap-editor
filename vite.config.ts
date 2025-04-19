import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"
import { TanStackRouterVite } from "@tanstack/router-plugin/vite"

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss(), TanStackRouterVite()],
    assetsInclude: ['**/*.lottie'],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        watch: {
            usePolling: true,
        },
        host: true,
        strictPort: true,
        port: 5175,
    }
})
