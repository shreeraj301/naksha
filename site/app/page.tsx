import Link from "next/link";
import { Giant } from "@/components/Giant";
import { Index } from "@/components/Index";
import { Ask } from "@/components/Ask";
import { NkButtons } from "@/components/Buttons";
import { indexData } from "@/lib/index-data";
import { HOME_ASKS } from "@/lib/asks";
import { GITHUB } from "@/lib/content";

export default function Home() {
  const { items, bands } = indexData();
  return (
    <>
      <section className="hero">
        <span className="hint" aria-hidden="true">Move across the name</span>
        <Giant />
        <div className="base">
          <p className="tag">A design system for my products.</p>
          <p className="lede">Tokens, {items.length} React components on React Aria, and rules an agent can read. One type family carries all of it, from the smallest label to this name.</p>
          <NkButtons className="row cta" items={[{ href: "/get-started/", label: "Get started", variant: "highlight", iconEnd: "arrow-right" }, { href: "/ai/", label: "Read with Claude", variant: "secondary" }]} />
        </div>
      </section>
      <Index items={items} bands={bands} />
      <section className="asks" aria-labelledby="ah">
        <Ask reqs={HOME_ASKS} fallback={3} chipsTo={3} layout="home" title="Answering from its own docs" note="Scripted demo" />
      </section>
      <section className="agents" aria-labelledby="agh">
        <h2 id="agh">For agents</h2>
        <ol>
          <li><b><a href="/llms.txt">llms.txt</a></b><span>One file that tells an agent what Naksha is and where every page lives.</span></li>
          <li><b><Link href="/ai/">AGENTS.md</Link></b><span>A block to paste into a project so the agent builds with Naksha instead of guessing.</span></li>
          <li><b><a href={`${GITHUB}/tree/main/skills/naksha`}>Agent Skill</a></b><span>The rules, tokens and every component, generated from the same sources as the CSS.</span></li>
        </ol>
      </section>
    </>
  );
}
