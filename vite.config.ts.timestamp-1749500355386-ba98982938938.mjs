// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
import { componentTagger } from "file:///home/project/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "/home/project";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080
  },
  plugins: [
    react(),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  build: {
    // Enhanced build configuration for better performance
    target: "esnext",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: mode === "production",
        drop_debugger: mode === "production"
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks for better caching
          vendor: ["react", "react-dom"],
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-select", "@radix-ui/react-tabs"],
          charts: ["recharts"],
          firebase: ["firebase/app", "firebase/auth", "firebase/firestore"]
        }
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1e3
  },
  define: {
    // Remove console.log in production - fixed to use proper JSON syntax
    ...mode === "production" && { "console.log": "() => {}" }
  },
  optimizeDeps: {
    // Pre-bundle dependencies for faster dev server startup
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "firebase/app",
      "firebase/auth",
      "firebase/firestore",
      "@radix-ui/react-dialog",
      "@radix-ui/react-select",
      "recharts"
    ]
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+ICh7XG4gIHNlcnZlcjoge1xuICAgIGhvc3Q6IFwiOjpcIixcbiAgICBwb3J0OiA4MDgwLFxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICBtb2RlID09PSAnZGV2ZWxvcG1lbnQnICYmXG4gICAgY29tcG9uZW50VGFnZ2VyKCksXG4gIF0uZmlsdGVyKEJvb2xlYW4pLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxuICAgIH0sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgLy8gRW5oYW5jZWQgYnVpbGQgY29uZmlndXJhdGlvbiBmb3IgYmV0dGVyIHBlcmZvcm1hbmNlXG4gICAgdGFyZ2V0OiAnZXNuZXh0JyxcbiAgICBtaW5pZnk6ICd0ZXJzZXInLFxuICAgIHRlcnNlck9wdGlvbnM6IHtcbiAgICAgIGNvbXByZXNzOiB7XG4gICAgICAgIGRyb3BfY29uc29sZTogbW9kZSA9PT0gJ3Byb2R1Y3Rpb24nLFxuICAgICAgICBkcm9wX2RlYnVnZ2VyOiBtb2RlID09PSAncHJvZHVjdGlvbicsXG4gICAgICB9LFxuICAgIH0sXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rczoge1xuICAgICAgICAgIC8vIFNwbGl0IHZlbmRvciBjaHVua3MgZm9yIGJldHRlciBjYWNoaW5nXG4gICAgICAgICAgdmVuZG9yOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbSddLFxuICAgICAgICAgIHVpOiBbJ0ByYWRpeC11aS9yZWFjdC1kaWFsb2cnLCAnQHJhZGl4LXVpL3JlYWN0LXNlbGVjdCcsICdAcmFkaXgtdWkvcmVhY3QtdGFicyddLFxuICAgICAgICAgIGNoYXJ0czogWydyZWNoYXJ0cyddLFxuICAgICAgICAgIGZpcmViYXNlOiBbJ2ZpcmViYXNlL2FwcCcsICdmaXJlYmFzZS9hdXRoJywgJ2ZpcmViYXNlL2ZpcmVzdG9yZSddLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIC8vIEluY3JlYXNlIGNodW5rIHNpemUgd2FybmluZyBsaW1pdFxuICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMTAwMCxcbiAgfSxcbiAgZGVmaW5lOiB7XG4gICAgLy8gUmVtb3ZlIGNvbnNvbGUubG9nIGluIHByb2R1Y3Rpb24gLSBmaXhlZCB0byB1c2UgcHJvcGVyIEpTT04gc3ludGF4XG4gICAgLi4uKG1vZGUgPT09ICdwcm9kdWN0aW9uJyAmJiB7ICdjb25zb2xlLmxvZyc6ICcoKSA9PiB7fScgfSksXG4gIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIC8vIFByZS1idW5kbGUgZGVwZW5kZW5jaWVzIGZvciBmYXN0ZXIgZGV2IHNlcnZlciBzdGFydHVwXG4gICAgaW5jbHVkZTogW1xuICAgICAgJ3JlYWN0JyxcbiAgICAgICdyZWFjdC1kb20nLFxuICAgICAgJ3JlYWN0LXJvdXRlci1kb20nLFxuICAgICAgJ2ZpcmViYXNlL2FwcCcsXG4gICAgICAnZmlyZWJhc2UvYXV0aCcsXG4gICAgICAnZmlyZWJhc2UvZmlyZXN0b3JlJyxcbiAgICAgICdAcmFkaXgtdWkvcmVhY3QtZGlhbG9nJyxcbiAgICAgICdAcmFkaXgtdWkvcmVhY3Qtc2VsZWN0JyxcbiAgICAgICdyZWNoYXJ0cycsXG4gICAgXSxcbiAgfSxcbn0pKTsiXSwKICAibWFwcGluZ3MiOiAiO0FBQXlOLFNBQVMsb0JBQW9CO0FBQ3RQLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsU0FBUyx1QkFBdUI7QUFIaEMsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE9BQU87QUFBQSxFQUN6QyxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sU0FBUyxpQkFDVCxnQkFBZ0I7QUFBQSxFQUNsQixFQUFFLE9BQU8sT0FBTztBQUFBLEVBQ2hCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQTtBQUFBLElBRUwsUUFBUTtBQUFBLElBQ1IsUUFBUTtBQUFBLElBQ1IsZUFBZTtBQUFBLE1BQ2IsVUFBVTtBQUFBLFFBQ1IsY0FBYyxTQUFTO0FBQUEsUUFDdkIsZUFBZSxTQUFTO0FBQUEsTUFDMUI7QUFBQSxJQUNGO0FBQUEsSUFDQSxlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUEsUUFDTixjQUFjO0FBQUE7QUFBQSxVQUVaLFFBQVEsQ0FBQyxTQUFTLFdBQVc7QUFBQSxVQUM3QixJQUFJLENBQUMsMEJBQTBCLDBCQUEwQixzQkFBc0I7QUFBQSxVQUMvRSxRQUFRLENBQUMsVUFBVTtBQUFBLFVBQ25CLFVBQVUsQ0FBQyxnQkFBZ0IsaUJBQWlCLG9CQUFvQjtBQUFBLFFBQ2xFO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQTtBQUFBLElBRUEsdUJBQXVCO0FBQUEsRUFDekI7QUFBQSxFQUNBLFFBQVE7QUFBQTtBQUFBLElBRU4sR0FBSSxTQUFTLGdCQUFnQixFQUFFLGVBQWUsV0FBVztBQUFBLEVBQzNEO0FBQUEsRUFDQSxjQUFjO0FBQUE7QUFBQSxJQUVaLFNBQVM7QUFBQSxNQUNQO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLEVBQUU7IiwKICAibmFtZXMiOiBbXQp9Cg==
