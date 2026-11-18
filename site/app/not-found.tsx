import Link from "next/link";
import { Fit } from "@/components/Fit";

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
