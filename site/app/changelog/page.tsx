import type { Metadata } from "next";
import { DocPage } from "@/components/DocPage";

export const metadata: Metadata = { title: "Changelog", description: "Every Naksha release, newest first: what was added, changed, fixed and removed in each version, with the reasons behind the bigger decisions.", alternates: { canonical: "/changelog/" } };
export default function Page() {
  return <DocPage title="Changelog" files={["CHANGELOG.md"]} />;
}
