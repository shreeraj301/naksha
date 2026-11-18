import type { Metadata } from "next";
import Link from "next/link";
import { Fit } from "@/components/Fit";

export const metadata: Metadata = {
  title: "Page not found",
  description: "Nothing is built at this address. Find the component you were after in the full list of Naksha components, or start again from the home page.",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <>
      <div className="band plain"><Fit text="Not here" /></div>
      <section className="lost">
        <p>Nothing is built at this address yet. The component may have a different name, or the page may have moved.</p>
        <div className="row"><Link className="nk-btn nk-btn--primary" href="/components/"><span>All components</span></Link><Link className="nk-btn nk-btn--secondary" href="/"><span>Home</span></Link></div>
      </section>
    </>
  );
}
