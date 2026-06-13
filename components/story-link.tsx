import Link from "next/link";
import type { ReactNode } from "react";
import type { SignalBrief } from "@/lib/types";
import { isRealExternalUrl } from "@/lib/utils";

function getStoryHref(brief: SignalBrief) {
  return brief.linkBehavior === "source" && isRealExternalUrl(brief.originalUrl) ? brief.originalUrl : `/brief/${brief.id}`;
}

function isExternal(brief: SignalBrief) {
  return brief.linkBehavior === "source" && isRealExternalUrl(brief.originalUrl);
}

export function StoryLink({
  brief,
  className,
  children,
  ariaLabel
}: {
  brief: SignalBrief;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  const href = getStoryHref(brief);

  if (isExternal(brief)) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}

export function getStoryHrefAndTarget(brief: SignalBrief) {
  return {
    href: getStoryHref(brief),
    external: isExternal(brief)
  };
}
