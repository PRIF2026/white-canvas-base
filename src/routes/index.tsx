import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Branco" },
      { name: "description", content: "Tela inicial do projeto Branco" },
      { property: "og:title", content: "Branco" },
      { property: "og:description", content: "Tela inicial do projeto Branco" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <h1 className="text-4xl font-semibold tracking-tight text-foreground">Branco</h1>
    </main>
  );
}
