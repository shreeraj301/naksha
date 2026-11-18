import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { components, component, asksFor, GITHUB } from "@/lib/content";
import { hueVar } from "@/lib/groups";
import { fixLinks } from "@/lib/links";
import { Fit } from "@/components/Fit";
import { LivePreview, Nk } from "@/components/Nk";
import { Ask } from "@/components/Ask";
import { CopyMarkdown } from "@/components/TopBar";

export function generateStaticParams() { return components().map((c) => ({ slug: c.slug })); }
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = component((await params).slug);
  return c ? { title: c.name, description: c.summary } : {};
}

const SKIP = new Set(["Release phase"]);
export default async function ComponentPage({ params }: { params: Promise<{ slug: string }> }) {
  const c = component((await params).slug); if (!c) notFound();
  const all = components(); const i = all.indexOf(c); const prev = all[i - 1], next = all[i + 1];
  const mates = all.filter((x) => x.group === c.group && x !== c).map((x) => x.name);
  const asks = asksFor(c);
  const sections = c.sections.filter((s) => !SKIP.has(s.title));
  return (
    <>
      <div className="band" data-theme="light" style={{ ["--hue" as string]: hueVar(c.group) }}>
        <Nk spec={{ $c: "Breadcrumb", p: { items: [{ label: "Components", href: "/components/" }, { label: c.group, href: "/components/" }, { label: c.name }] } }} />
        <Fit text={c.name} />
      </div>
      <div className="cbody">
        <div className="main">
          <div className="lede" dangerouslySetInnerHTML={{ __html: c.introHtml }} />
          <dl>
            <dt>Group</dt><dd>{c.group}{mates.length ? `, with ${mates.join(", ")}` : ""}</dd>
            {c.phase && <><dt>Release</dt><dd>{c.phase}</dd></>}
            {c.changed && <><dt>Last change</dt><dd>{c.changed}</dd></>}
          </dl>
          <div className="row tools"><CopyMarkdown text={c.readme} /><a className="nk-btn nk-btn--ghost nk-btn--sm" href={`${GITHUB}/blob/main/artifact/components/${c.name}/README.md`}><span>README on GitHub</span></a></div>
          {c.preview && (
            <figure className="stage" style={{ marginInline: 0 }}>
              <figcaption className="bar"><span>Every state, live</span><span>From the README preview</span></figcaption>
              <LivePreview className="live" html={c.preview} />
            </figure>
          )}
          <div className="prose">
            {sections.map((s) => (
              <section key={s.id} aria-labelledby={s.id}>
                <h2 id={s.id}>{s.title}</h2>
                <div dangerouslySetInnerHTML={{ __html: fixLinks(s.html, `artifact/components/${c.name}`) }} />
              </section>
            ))}
          </div>
          <nav className="next" aria-label="More components">
            {prev ? <Link href={`/components/${prev.slug}/`}><span>Previous</span><b>{prev.name}</b></Link> : <span />}
            {next ? <Link href={`/components/${next.slug}/`}><span>Next</span><b>{next.name}</b></Link> : <span />}
          </nav>
        </div>
        {asks.length > 0 && <Ask reqs={asks} layout="side" title={`Ask about ${c.name}`} note="Answers quote the README" />}
      </div>
    </>
  );
}
