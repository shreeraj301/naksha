import type { Metadata } from "next";
import { Index } from "@/components/Index";
import { indexData } from "@/lib/index-data";
import { Fit } from "@/components/Fit";
import { componentCount } from "@/lib/content";

export const metadata: Metadata = {
  title: "Components",
  description: `All ${componentCount()} Naksha components, running live in seven groups, from buttons and form fields to overlays, chat and navigation. Each links to its spec.`,
  alternates: { canonical: "/components/" },
};
export default function ComponentsPage() {
  const { items, bands } = indexData();
  return (
    <>
      <div className="band plain"><Fit text="Components" /></div>
      <Index items={items} bands={bands} />
    </>
  );
}
