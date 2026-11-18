import { doc } from "@/lib/content";
import { fixLinks, swatches } from "@/lib/links";
import { Fit } from "./Fit";
import { CopyMarkdown } from "./TopBar";

/* A page made of one or more markdown files from the repo. Each section keeps its own heading; the table of contents lists them. */
export function DocPage({ title, files, intro, only }: { title: string; files: string[]; intro?: string; only?: string[] }) {
  const docs = files.map((f) => ({ f, d: doc(f) }));
  const sections = docs.flatMap(({ f, d }) => d.sections.filter((s) => !only || only.includes(s.title)).map((s) => ({ ...s, f, html: swatches(fixLinks(s.html, f.includes("/") ? f.slice(0, f.lastIndexOf("/")) : "")) })));
  const firstIntro = intro ?? docs[0].d.introHtml;
  const raw = docs.map(({ d }) => d.raw).join("\n\n");
  return (
    <>
      <div className="band plain"><Fit text={title} /></div>
      <div className="dbody">
        <nav className="toc" aria-label="On this page"><b>On this page</b>{sections.map((s) => <a key={s.id} href={`#${s.id}`}>{s.title}</a>)}</nav>
        <div className="prose">
          {firstIntro && <div className="intro" dangerouslySetInnerHTML={{ __html: fixLinks(firstIntro, "") }} />}
          <div className="row" style={{ marginTop: "var(--space-16)" }}><CopyMarkdown text={raw} /></div>
          {sections.map((s) => (
            <section key={s.f + s.id} aria-labelledby={s.id}><h2 id={s.id}>{s.title}</h2><div dangerouslySetInnerHTML={{ __html: s.html }} /></section>
          ))}
        </div>
      </div>
    </>
  );
}
