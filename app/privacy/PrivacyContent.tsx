"use client";

import { useRouter } from "next/navigation";
import {
  privacyContent,
  type Block,
  type Lead,
  type PrivacySection,
} from "@/content/privacy";

const c = privacyContent;

/** A "Label. Rest" run, used as both a paragraph and a bullet. */
function LeadRun({ lead, rest }: Lead) {
  return (
    <>
      <strong className="font-medium text-navy-950">{lead}</strong>
      {rest}
    </>
  );
}

/** Bottom margin per block, reproducing the spacing the hardcoded page had:
 *  the last block in a section carries none, the firm-name line carries mb-2,
 *  everything else mb-4. Returns undefined rather than "" so React omits the
 *  attribute entirely and the markup matches the original byte for byte. */
function marginFor(block: Block, isLast: boolean): string | undefined {
  if (block.kind === "strong") return "mb-2";
  return isLast ? undefined : "mb-4";
}

function BlockView({ block, isLast }: { block: Block; isLast: boolean }) {
  const mb = marginFor(block, isLast);

  switch (block.kind) {
    case "text":
      return <p className={mb}>{block.text}</p>;

    case "lead":
      return (
        <p className={mb}>
          <LeadRun lead={block.lead} rest={block.rest} />
        </p>
      );

    case "strong":
      return (
        <p className={mb}>
          <strong className="font-medium text-navy-950">{block.text}</strong>
        </p>
      );

    case "link":
      return (
        <p className={mb}>
          {block.pre}
          <a
            href={block.href}
            {...(block.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="text-gold-500 underline hover:text-gold-400"
          >
            {block.linkText}
          </a>
          {block.post}
        </p>
      );

    case "bullets":
      return (
        <ul className={mb ? `list-disc pl-6 space-y-2 ${mb}` : "list-disc pl-6 space-y-2"}>
          {block.items.map((item) =>
            typeof item === "string" ? (
              <li key={item}>{item}</li>
            ) : (
              <li key={item.lead}>
                <LeadRun lead={item.lead} rest={item.rest} />
              </li>
            )
          )}
        </ul>
      );
  }
}

function SectionView({ section }: { section: PrivacySection }) {
  // The closing disclaimer is a single small italic paragraph above a hairline.
  if (section.disclaimer) {
    const only = section.blocks[0];
    return (
      <section className="pt-8 border-t border-stone-200">
        <p className="text-sm text-stone-500 italic leading-relaxed">
          {only.kind === "text" ? only.text : null}
        </p>
      </section>
    );
  }

  return (
    <section>
      {section.heading && (
        <h2 className="font-serif text-2xl font-normal text-navy-950 mb-4">
          {section.heading}
        </h2>
      )}
      {section.blocks.map((block, i) => (
        <BlockView
          key={i}
          block={block}
          isLast={i === section.blocks.length - 1}
        />
      ))}
    </section>
  );
}

export default function PrivacyContent() {
  const router = useRouter();

  return (
    <div className="pt-32 pb-24 bg-white text-navy-950">
      <div className="w-full px-6 md:px-16">
        <button
          onClick={() => router.back()}
          className="text-xs text-stone-500 hover:text-gold-500 transition-colors mb-8 inline-flex items-center gap-2 cursor-pointer"
          style={{ letterSpacing: "0.05em" }}
        >
          <span aria-hidden="true">&larr;</span>
          {c.backLabel}
        </button>
        <p
          className="text-[11px] font-medium text-gold-500 mb-4"
          style={{ letterSpacing: "0.18em" }}
        >
          {c.eyebrow}
        </p>
        <h1
          className="font-serif text-4xl md:text-5xl font-normal mb-3"
          style={{ letterSpacing: "-0.01em" }}
        >
          {c.title}
        </h1>
        <p className="text-sm text-stone-500 mb-12">
          Effective {c.effectiveDate}
        </p>

        <div className="space-y-10 text-base text-stone-700 leading-relaxed">
          {c.sections.map((section, i) => (
            <SectionView key={section.heading ?? `s${i}`} section={section} />
          ))}
        </div>
      </div>
    </div>
  );
}
