import type { Metadata } from "next";
import { Index } from "@/components/Index";
import { indexData } from "@/lib/index-data";
import { Fit } from "@/components/Fit";

export const metadata: Metadata = { title: "Components", description: "All 34 Naksha components, live, in seven groups." };
export default function ComponentsPage() {
  const { items, bands } = indexData();
  return (
    <>
      <div className="band plain"><Fit text="Components" /></div>
      <Index items={items} bands={bands} />
    </>
  );
}
