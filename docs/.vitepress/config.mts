import { defineConfig } from 'vitepress'
import { ViteImageOptimizer} from 'vite-plugin-image-optimizer'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "RealWorld Nextjs Supabase",
  description: "A RealWorld Nextjs Supabase project",
  base: "/realworld-nextjs-supabase/",
  lastUpdated: true,
  ignoreDeadLinks: [
    /^https?:\/\/localhost/,
  ],
  vite: {
    // Build optimization to handle chunk size warnings
    build: {
      chunkSizeWarningLimit: Infinity, // Disable chunk size warnings for docs
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Split node_modules into more granular chunks
            if (id.includes("node_modules")) {
              if (id.includes("vue")) {
                return "vue";
              }
              if (id.includes("vitepress")) {
                return "vitepress";
              }
              if (id.includes("@vueuse")) {
                return "vueuse";
              }
              if (id.includes("markdown-it")) {
                return "markdown";
              }
              if (id.includes("shiki") || id.includes("highlight")) {
                return "syntax-highlight";
              }
              if (id.includes("lodash") || id.includes("ramda")) {
                return "utils";
              }
              // Other vendor libraries
              return "vendor";
            }

            // Split large documentation files if any
            if (id.includes("/docs/")) {
              if (id.includes("/onboarding-guide/")) {
                return "docs-onboarding-guide";
              }
            }
          },
        },
      },
    },
    plugins: [ViteImageOptimizer({})],
  },
  head: [
    // Favicon configurations
    ["link", { rel: "shortcut icon", href: "/favicon.ico", sizes: "48x48" }],
    ["link", { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" }],
    [
      "link",
      {
        rel: "icon",
        href: "/favicon-96x96.png",
        type: "image/png",
        sizes: "96x96",
      },
    ],
    [
      "link",
      {
        rel: "apple-touch-icon",
        href: "/apple-touch-icon.png",
        sizes: "180x180",
      },
    ],
    ["link", { rel: "manifest", href: "/site.webmanifest" }],
  ],
  locales: {
    root: {
      label: "English",
      lang: "en",
      themeConfig: {
        outline: {
          level: [2, 3],
        },
        nav: [
          { text: "Home", link: "/" },
          { text: "Roadmap", link: "/roadmap" },
          { text: "Onboarding Guide", link: "/onboarding-guide/index" },
        ],
        sidebar: [
          {
            text: "Content",
            items: [{ text: "Roadmap", link: "/roadmap" }],
          },
          {
            text: "Onboarding Guide",
            items: [
              { text: "Overview", link: "/onboarding-guide/index" },
              { text: "Introduction", link: "/onboarding-guide/introduction" },
              { text: "Setup", link: "/onboarding-guide/setup" },
              { text: "Authentication", link: "/onboarding-guide/authentication" },
              { text: "Authorization (RLS & Policy)", link: "/onboarding-guide/authorization-rls" },
              { text: "Database & Migrations", link: "/onboarding-guide/database-migrations" },
              { text: "Integration", link: "/onboarding-guide/integration" },
              { text: "Batch Job & Background Tasks", link: "/onboarding-guide/batch-jobs" },
              { text: "API & Integration Patterns", link: "/onboarding-guide/api-integration-patterns" },
              { text: "CI/CD & DevOps", link: "/onboarding-guide/cicd-devops" },
              { text: "Observability & Debugging", link: "/onboarding-guide/observability-debugging" },
              { text: "Security Best Practices", link: "/onboarding-guide/security" },
              { text: "Cost & Performance Optimization", link: "/onboarding-guide/performance-optimization" },
              { text: "Comparison with Traditional Stack", link: "/onboarding-guide/comparison-traditional-stack" },
              { text: "Advanced", link: "/onboarding-guide/advanced" },
              { text: "References", link: "/onboarding-guide/references" },
            ],
          },
        ],
      },
    },
    vi: {
      label: "Tiếng Việt",
      lang: "vi",
      link: "/vi/",
      themeConfig: {
        lastUpdated: {
          text: "Cập nhật lần cuối",
        },
        editLink: {
          text: "Chỉnh sửa trang này",
        },
        outline: {
          label: "Mục lục",
          level: [2, 3],
        },
        nav: [
          { text: "Trang chủ", link: "/vi/" },
          { text: "Lộ trình", link: "/vi/roadmap" },
          { text: "Hướng dẫn bắt đầu", link: "/vi/onboarding-guide/index" },
        ],
        sidebar: [
          {
            text: "Nội dung",
            items: [{ text: "Lộ trình", link: "/vi/roadmap" }],
          },
          {
            text: "Hướng dẫn bắt đầu",
            items: [
              { text: "Tổng quan", link: "/vi/onboarding-guide/index" },
              { text: "Giới thiệu & Tổng quan", link: "/vi/onboarding-guide/introduction" },
              { text: "Cài đặt & Chuẩn bị môi trường", link: "/vi/onboarding-guide/setup" },
              { text: "Authentication", link: "/vi/onboarding-guide/authentication" },
              { text: "Authorization (RLS & Policy)", link: "/vi/onboarding-guide/authorization-rls" },
              { text: "Database & Migrations", link: "/vi/onboarding-guide/database-migrations" },
              { text: "Integration", link: "/vi/onboarding-guide/integration" },
              { text: "Batch Job & Background Tasks", link: "/vi/onboarding-guide/batch-jobs" },
              { text: "API & Integration Patterns", link: "/vi/onboarding-guide/api-integration-patterns" },
              { text: "CI/CD & DevOps", link: "/vi/onboarding-guide/cicd-devops" },
              { text: "Observability & Debugging", link: "/vi/onboarding-guide/observability-debugging" },
              { text: "Security Best Practices", link: "/vi/onboarding-guide/security" },
              { text: "Cost & Performance Optimization", link: "/vi/onboarding-guide/performance-optimization" },
              { text: "So sánh với Techstack truyền thống", link: "/vi/onboarding-guide/comparison-traditional-stack" },
              { text: "Phụ lục (Advanced)", link: "/vi/onboarding-guide/advanced" },
              { text: "Tài liệu tham khảo", link: "/vi/onboarding-guide/references" },
            ],
          },
        ],
      },
    },
  },
  themeConfig: {
    logo: "/logo.svg",
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/vndevteam/realworld-nextjs-supabase",
      },
    ],
    search: {
      provider: "local",
    },
    editLink: {
      pattern: "https://github.com/vndevteam/realworld-nextjs-supabase/edit/main/docs/:path",
    },
    footer: {
      message: "Released under the <a href='https://github.com/vndevteam/realworld-nextjs-supabase/blob/main/LICENSE'>MIT License</a>.",
      copyright: "Copyright © 2025 VNDevTeam",
    },
  },
});
