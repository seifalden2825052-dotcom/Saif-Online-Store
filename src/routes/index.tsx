import { createFileRoute } from "@tanstack/react-router";
import App from "../App.jsx";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AuraTech — Next-Gen Electronics" },
      { name: "description", content: "Discover premium next-generation electronics at AuraTech." },
      { property: "og:title", content: "AuraTech — Next-Gen Electronics" },
      { property: "og:description", content: "Discover premium next-generation electronics at AuraTech." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: App,
});
