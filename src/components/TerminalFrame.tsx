import type { ReactNode } from 'react';

type TerminalFrameProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

export function TerminalFrame({ title, children, className = '' }: TerminalFrameProps) {
  return (
    <article className={`terminal-frame ${className}`} aria-label={title}>
      <div className="terminal-body">
        <div className="slide-content">{children}</div>
      </div>
    </article>
  );
}
