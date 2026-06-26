type TerminalPromptProps = {
  command: string;
  path?: string;
  cursor?: boolean;
};

export function TerminalPrompt({ command, path = '~/deck', cursor = false }: TerminalPromptProps) {
  return (
    <div className="terminal-prompt">
      <span className="prompt-user">dev</span>
      <span className="prompt-separator">:</span>
      <span className="prompt-path">{path}</span>
      <span className="prompt-symbol">$</span>
      <span className="prompt-command">{command}</span>
      {cursor && <span className="cursor" aria-hidden="true" />}
    </div>
  );
}
