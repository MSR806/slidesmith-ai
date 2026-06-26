import type { ReactNode } from 'react';

type FilePanelProps = {
  filename: string;
  children: ReactNode;
  tone?: 'green' | 'amber' | 'cyan';
};

export function FilePanel({ filename, children, tone = 'cyan' }: FilePanelProps) {
  return (
    <section className={`file-panel ${tone}`}>
      <header className="file-panel-header">
        <span className="file-dot" />
        <span>{filename}</span>
      </header>
      <div className="file-panel-body">{children}</div>
    </section>
  );
}
