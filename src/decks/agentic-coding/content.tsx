import { type ReactNode } from "react";
import { FilePanel } from "../../components/FilePanel";
import { TerminalFrame } from "../../components/TerminalFrame";

type ListSection = {
  title?: string;
  items: string[];
};

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="bullet-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function SimpleSlide({
  title,
  children,
  section,
}: {
  title: string;
  children: ReactNode;
  section?: string;
}) {
  return (
    <TerminalFrame title={section ?? title.toLowerCase().replaceAll(" ", "-")}>
      <div className="simple-slide">
        {section && <p className="eyebrow">{section}</p>}
        <h1>{title}</h1>
        {children}
      </div>
    </TerminalFrame>
  );
}

function ContentSlide({ title, items }: { title: string; items: string[] }) {
  return (
    <SimpleSlide title={title} section="content">
      <BulletList items={items} />
    </SimpleSlide>
  );
}

function TechniqueSlide({
  title,
  technique,
  extra,
}: {
  title: string;
  technique: string;
  extra?: ListSection;
}) {
  return (
    <SimpleSlide title={title} section="technique">
      <div>
        <p className="lead technique-lead">{technique}</p>
        {extra && (
          <>
            {extra.title && <h3>{extra.title}</h3>}
            <BulletList items={extra.items} />
          </>
        )}
      </div>
    </SimpleSlide>
  );
}

function TwoColumnSlide({
  title,
  left,
  right,
}: {
  title: string;
  left: ListSection;
  right: ListSection;
}) {
  return (
    <SimpleSlide title={title} section="tools">
      <div className="two-column">
        <section className="content-card">
          {left.title && <h2>{left.title}</h2>}
          <BulletList items={left.items} />
        </section>
        <section className="content-card">
          {right.title && <h2>{right.title}</h2>}
          <BulletList items={right.items} />
        </section>
      </div>
    </SimpleSlide>
  );
}

const tokenEvents = [
  {
    kind: "user",
    label: "message: fix failing checkout test",
    amount: "5k",
    formula: "+ 5k",
    total: "5k",
    output: "",
    sessionInput: "0",
    sessionOutput: "0",
    sessionTotal: "0",
  },
  {
    kind: "assistant",
    label: "tool request: read_file",
    amount: "550",
    formula: "+ 5k + 550",
    total: "5.55k",
    output: "550",
    sessionInput: "5k",
    sessionOutput: "550",
    sessionTotal: "5.55k",
  },
  {
    kind: "tool",
    label: "tool response: checkout.test.ts",
    amount: "2k",
    formula: "+ 5k + 550 + 2k",
    total: "7.55k",
    output: "",
    sessionInput: "5k",
    sessionOutput: "550",
    sessionTotal: "5.55k",
  },
  {
    kind: "assistant",
    label: "message: found broken assertion",
    amount: "4k",
    formula: "+ 5k + 550 + 2k + 4k",
    total: "11.55k",
    output: "4k",
    sessionInput: "12.55k",
    sessionOutput: "4.55k",
    sessionTotal: "17.1k",
  },
  {
    kind: "assistant",
    label: "tool request: write_file patch",
    amount: "650",
    formula: "+ 5k + 550 + 2k + 4k + 650",
    total: "12.2k",
    output: "650",
    sessionInput: "24.1k",
    sessionOutput: "5.2k",
    sessionTotal: "29.3k",
  },
  {
    kind: "tool",
    label: "tool response: patch applied",
    amount: "3k",
    formula: "+ 5k + 550 + 2k + 4k + 650 + 3k",
    total: "15.2k",
    output: "",
    sessionInput: "24.1k",
    sessionOutput: "5.2k",
    sessionTotal: "29.3k",
  },
  {
    kind: "assistant",
    label: "tool request: run tests",
    amount: "1k",
    formula: "+ 5k + 550 + 2k + 4k + 650 + 3k + 1k",
    total: "16.2k",
    output: "1k",
    sessionInput: "39.3k",
    sessionOutput: "6.2k",
    sessionTotal: "45.5k",
  },
  {
    kind: "tool",
    label: "tool response: npm test logs",
    amount: "700",
    formula: "+ 5k + 550 + 2k + 4k + 650 + 3k + 1k + 700",
    total: "16.9k",
    output: "",
    sessionInput: "39.3k",
    sessionOutput: "6.2k",
    sessionTotal: "45.5k",
  },
  {
    kind: "assistant",
    label: "message: tests passed, summary ready",
    amount: "2.5k",
    formula: "+ 5k + 550 + 2k + 4k + 650 + 3k + 1k + 700 + 2.5k",
    total: "19.4k",
    output: "2.5k",
    sessionInput: "56.2k",
    sessionOutput: "8.7k",
    sessionTotal: "64.9k",
  },
];

export const TOKEN_PROBLEM_STEP_COUNT = tokenEvents.length + 1;

const toolingTopics = [
  {
    name: "Agents.md / Claude.md",
    filename: "repo/AGENTS.md",
    details: [
      "Repo-level instructions",
      "Loaded directly into context",
      "Setup, tests, conventions, architecture notes, PR expectations",
    ],
  },
  {
    name: "MCPs / Plugins",
    filename: "tools/mcps.json",
    details: [
      "Connect agents with live systems and data",
      "Examples: GitHub, Linear, Slack, DB, Sentry, internal APIs",
      "Fetch current context instead of guessing",
    ],
  },
  {
    name: "Skills",
    filename: "skills/debugging/SKILL.md",
    details: [
      "Reusable domain knowledge and working principles",
      "Team conventions, debugging playbooks, release and testing patterns",
      "Convert tribal knowledge into agent-usable knowledge",
    ],
  },
  {
    name: "Slash Commands",
    filename: "commands/plan.md",
    details: [
      "Repeated instructions packaged as commands",
      "Examples: /plan, /review-pr, /debug, /write-tests, /check-risk",
      "Standardize common workflows",
    ],
  },
  {
    name: "Agents / Subagents",
    filename: "agents/reviewer.md",
    details: [
      "Different roles get different context, tools, models, and focus",
      "Examples: reviewer, test writer, debugger, security reviewer",
      "Useful for focused work and parallelism",
    ],
  },
  {
    name: "Basic workflow controls",
    filename: "session.controls",
    details: ["/undo", "/fork", "/new", "/compact"],
  },
];

export const TOOLING_FEATURES_STEP_COUNT = toolingTopics.length;
export const DELEGATE_SUBAGENTS_STEP_COUNT = 3;

const withoutSubagentEvents = [
  ["user", "debug checkout failure", "5k (+5k)"],
  ["tool", "grep", "6.5k (+1.5k)"],
  ["tool", "glob", "8.5k (+2k)"],
  ["tool", "read_file", "12k (+3.5k)"],
  ["tool", "read_file", "16k (+4k)"],
  ["tool", "read_file", "19.5k (+3.5k)"],
  ["tool", "read_file", "23.5k (+4k)"],
  ["assistant", "tool request", "25k (+1.5k)"],
  ["tool", "tool response", "27k (+2k)"],
  ["assistant", "assistant message", "29k (+2k)"],
] as const;

const mainThreadEvents = [
  ["user", "debug checkout failure", "5k (+5k)"],
  ["assistant", "invoke_subagent(debugger)", "6.5k (+1.5k)"],
  ["assistant", "assistant summary", "8.5k (+2k)"],
] as const;

const subagentThreadEvents = [
  ["user", "focused task + context", "4k (+4k)"],
  ["tool", "grep", "5.5k (+1.5k)"],
  ["tool", "glob", "7.5k (+2k)"],
  ["tool", "read_file", "11k (+3.5k)"],
  ["tool", "read_file", "15k (+4k)"],
  ["tool", "read_file", "18.5k (+3.5k)"],
  ["tool", "read_file", "22.5k (+4k)"],
  ["assistant", "tool request", "24k (+1.5k)"],
  ["tool", "tool response", "26k (+2k)"],
  ["assistant", "assistant message", "28k (+2k)"],
] as const;

function StaticTokenEvent({
  kind,
  label,
  amount,
  quiet = false,
}: {
  kind: string;
  label: string;
  amount: string;
  quiet?: boolean;
}) {
  return (
    <div
      className={`token-event token-event-${kind} static-token-event ${quiet ? "is-quiet" : ""}`}
    >
      <span className={`event-kind event-kind-${kind}`}>{kind}</span>
      <span className="event-label">{label}</span>
      <span className="event-amount">{amount}</span>
    </div>
  );
}

function SubagentContextDiagram({ mode }: { mode: "without" | "with" }) {
  return (
    <div
      className={`subagent-diagram subagent-diagram-${mode}`}
      aria-label="Main thread context stays lean when noisy investigation runs in an isolated subagent"
    >
      {mode === "without" && (
        <section className="subagent-panel subagent-panel-without">
          <div className="subagent-panel-header">
            <span>without subagents</span>
            <strong>main thread: 29k</strong>
          </div>
          <p className="subagent-panel-note">
            bloated main thread carries every investigation event
          </p>
          <div className="subagent-event-list">
            {withoutSubagentEvents.map(([kind, label, amount]) => (
              <StaticTokenEvent
                kind={kind}
                label={label}
                amount={amount}
                key={label}
              />
            ))}
          </div>
        </section>
      )}

      {mode === "with" && (
        <section className="subagent-panel subagent-panel-with">
          <div className="subagent-panel-header">
            <span>with subagents</span>
            <strong>main thread: 8.5k</strong>
          </div>
          <p className="subagent-panel-note">main-thread context stays lean</p>
          <div className="subagent-split">
            <div className="subagent-thread subagent-thread-main">
              <div className="subagent-thread-title">main thread</div>
              {mainThreadEvents.map(([kind, label, amount]) => (
                <StaticTokenEvent
                  kind={kind}
                  label={label}
                  amount={amount}
                  key={label}
                />
              ))}
            </div>
            <div className="subagent-flow" aria-hidden="true">
              <span className="subagent-flow-out">handoff -&gt;</span>
              <span className="subagent-flow-back">&lt;- summary</span>
            </div>
            <div className="subagent-thread subagent-thread-worker">
              <div className="subagent-thread-title">
                isolated subagent thread
              </div>
              {subagentThreadEvents.map(([kind, label, amount]) => (
                <StaticTokenEvent
                  kind={kind}
                  label={label}
                  amount={amount}
                  quiet
                  key={label}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function TokenProblemAnimation({ step = 0 }: { step?: number }) {
  const activeIndex = Math.min(Math.max(step, 0), tokenEvents.length - 1);
  const activeEvent = tokenEvents[activeIndex];
  const visibleEvents = tokenEvents.slice(0, activeIndex + 1);

  return (
    <div
      className="token-problem-animation"
      aria-label="Looping token accounting sequence"
    >
      <div className="token-session-log">
        {visibleEvents.map((event, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              className={`token-event token-event-${event.kind} ${isActive ? "is-active" : ""}`}
              key={event.label}
            >
              <span className={`event-kind event-kind-${event.kind}`}>
                {event.kind}
              </span>
              <span className="event-label">{event.label}</span>
              <span className="event-amount">+{event.amount}</span>
            </div>
          );
        })}
      </div>

      <div className="token-accounting" aria-live="polite">
        <p className="accounting-label">Current LLM call</p>
        <p className="accounting-sub-label">Input tokens</p>
        <p className="accounting-total">{activeEvent.total}</p>
        <p className="accounting-formula">{activeEvent.formula}</p>
        <p
          className={`accounting-output ${activeEvent.output ? "" : "is-empty"}`}
        >
          Output tokens: {activeEvent.output || "0"}
        </p>
      </div>

      <div className="token-accounting session-accounting" aria-live="polite">
        <p className="accounting-label">Session total</p>
        <div className="session-metric">
          <span>Input tokens</span>
          <strong>{activeEvent.sessionInput}</strong>
        </div>
        <div className="session-metric">
          <span>Output tokens</span>
          <strong>{activeEvent.sessionOutput}</strong>
        </div>
        <p className="session-total">
          Total tokens: {activeEvent.sessionTotal}
        </p>
      </div>

      <p className="token-step-hint">
        step {activeIndex + 1}/{tokenEvents.length} · press → / Space
      </p>
    </div>
  );
}

export function TitleSlide() {
  return (
    <TerminalFrame title="agentic-coding">
      <div className="title-slide">
        <p className="eyebrow">boot</p>
        <h1>Agentic Coding: Harness &amp; Optimisation</h1>
        <p className="subtitle">
          Last year was model capability. This year is harness and optimisation.
        </p>
        <div className="agenda-list" aria-label="Agenda">
          <h2>Agenda</h2>
          <ul>
            <li>Basics</li>
            <li>Features</li>
            <li>Techniques</li>
          </ul>
        </div>
      </div>
    </TerminalFrame>
  );
}

export function HowAgentsWorkSlide() {
  return (
    <SimpleSlide title="How Agents Actually Work" section="tools">
      <p className="lead">
        Agents are loops around LLMs; tools are how they interact with the
        world.
      </p>
      <BulletList
        items={[
          "Every input appends to message history",
          "Message history becomes the context window",
          "Filesystem, terminal, and search interactions are tool calls",
          "MCPs/plugins are tool calls",
          "Skills add reusable instruction and context",
          "Subagents are also a tool call.",
        ]}
      />
    </SimpleSlide>
  );
}

export function TokenProblemSlide({ slideStep = 0 }: { slideStep?: number }) {
  const tokenProblemItems = [
    "Context grows cumulatively",
    "Every message adds tokens",
    "Every tool call adds tokens",
    "Every correction and failed attempt stays in history",
    "Reasoning tokens increases the output tokens",
    "Input and output tokens are billed; output tokens are usually more expensive",
  ];

  return (
    <SimpleSlide title="The Token Problem" section="context">
      {slideStep === 0 ? (
        <BulletList items={tokenProblemItems} />
      ) : (
        <TokenProblemAnimation step={slideStep - 1} />
      )}
    </SimpleSlide>
  );
}

export function CoreFrameworkSlide() {
  return (
    <SimpleSlide title="Harness" section="harness">
      <p className="lead">How do we harness LLM capability?</p>
      <h3>Give the agent</h3>
      <BulletList
        items={[
          "Right Context",
          "Right Tools",
          "Right Direction",
          "Right Expectations",
        ]}
      />
      <h3>Optimise for</h3>
      <BulletList items={["Time", "Cost"]} />
    </SimpleSlide>
  );
}

export function ToolingFeaturesSlide({
  slideStep = 0,
}: {
  slideStep?: number;
}) {
  const activeIndex = Math.min(
    Math.max(slideStep, 0),
    toolingTopics.length - 1,
  );
  const activeTopic = toolingTopics[activeIndex];

  return (
    <SimpleSlide title="Tooling Features" section="harness">
      <p className="lead">Building blocks of the agentic coding harness.</p>
      <div className="tooling-browser">
        <aside className="topic-tree" aria-label="Tooling features">
          {toolingTopics.map((topic, index) => (
            <div
              className={`topic-node ${index === activeIndex ? "is-active" : ""}`}
              key={topic.name}
            >
              <span>{topic.name}</span>
            </div>
          ))}
        </aside>
        <div className="topic-details" key={activeTopic.name}>
          <BulletList items={activeTopic.details} />
        </div>
      </div>
    </SimpleSlide>
  );
}

export function PlanFirstSlide() {
  return (
    <TechniqueSlide
      title="Plan First"
      technique="Ask the agent to plan before acting."
      extra={{
        items: [
          "Ask it to inspect first",
          "Ask it to propose a plan",
          "Review/Approve before the implementation",
        ],
      }}
    />
  );
}

export function AskQuestionsSlide() {
  return (
    <TechniqueSlide
      title="Ask Me Questions"
      technique="Always include this in your 1st message"
      extra={{
        items: [
          '"Ask me question if you have any before you start the implementation"',
          "This avoids silent assumptions LLM usually make",
          "All the ambiquity surfaces upfront",
          "Instead of you figuring out what all context agent needs, by doing this excersise agent will pull all the context it requires from you.",
          "You will be shocked how much extra context you add by just answering these questions, including edge cases you would not have thought to mention or even consider",
        ],
      }}
    />
  );
}

export function BringApproachSlide() {
  return (
    <TechniqueSlide
      title="Have Your Own Approach"
      technique="Anchors shape both you and the agent."
      extra={{
        items: [
          "Anchor bias: the first plausible approach becomes the reference point",
          "If you have no approach in mind, the agent’s first plan can feel like the best plan",
          "Have your own rough solution based on your experience before asking the agent",
          "Use that baseline to judge whether the agent chose a better, worse, or different path",
          "The bias applies to agents too: if you give your approach, the agent will often work around that anchor instead of exploring alternatives",
          "Be mindfull of this."
        ],
      }}
    />
  );
}

export function PlayToStrengthsSlide() {
  return (
    <TechniqueSlide
      title="Play to Strengths"
      technique="LLMs are strongest on patterns they have seen before."
      extra={{
        items: [
          "If the task is already represented in training data, the model can reuse known patterns and perform very well",
          "If the task is not in training data, performance drops unless you provide the missing context, examples, docs, or tools",
        ],
      }}
    />
  );
}

export function DelegateSubagentsSlide({
  slideStep = 0,
}: {
  slideStep?: number;
}) {
  if (slideStep === 0) {
    return (
      <TechniqueSlide
        title="Delegate to Subagents"
        technique="Keep the main thread lean."
        extra={{
          items: [
            "Keep the main context lean",
            "Offload scoped tasks with clear outcomes",
            "Use specialized agents for different perspectives",
            "Bring back only outcomes and key decisions",
            "Main thread stays lean, longer-running, and cost effective",
            "Works best for mid-size or large tasks, not small direct asks",
          ],
        }}
      />
    );
  }

  return (
    <SimpleSlide title="Delegate to Subagents" section="technique">
      <p className="lead technique-lead">Don’t do everything in the main thread.</p>
      <SubagentContextDiagram mode={slideStep === 1 ? "without" : "with"} />
    </SimpleSlide>
  );
}

export function ModelSelectionSlide() {
  return (
    <TechniqueSlide
      title="Model Selection"
      technique="Use right model for the task. You don't need GPT-5.5/Opus 4.6 on xhigh all the time"
      extra={{
        items: [
          "Powerful model as orchestrator",
          "Smaller/faster/less reasoning models for subagents",
          "Debugging or Architecture decisions may need stronger reasoning models",
          "Simple edits do not need the strongest model",
          "Adjust reasoning effort based on complexity",
        ],
      }}
    />
  );
}

export function ManageContextSlide() {
  return (
    <TechniqueSlide
      title="Manage Context"
      technique="Don’t let bad context pile up."
      extra={{
        items: [
          "LLms performance often peaks or plateaus around 40%–70% of maximum context, and then degrades when the prompt fills >75–80% of the window",
          "Undo bad messages when possible",
          "Avoid mistake → correction → mistake loops",
          "Start a new session when the task changes",
          "Compact long sessions",
          "Keep only useful context",
        ],
      }}
    />
  );
}

export function TurnOffUnusedMcpsSlide() {
  return (
    <TechniqueSlide
      title="Turn Off Unused MCPs"
      technique="MCPs comes with a overhead."
      extra={{
        items: [
          "All MCPs add tool descriptions into the context",
          "You don't see it but this is actually huge",
          "Keep only relevant MCPs enabled and disable everything else",
        ],
      }}
    />
  );
}

export function BuildForAgentsSlide() {
  return (
    <SimpleSlide title="Build for Agents, Not Humans" section="technique">
      <p className="lead technique-lead">Internal tools should be agent-usable.</p>
      <p className="lead technique-lead">
        Ask this for every internal tool: Could an agent use this directly?
      </p>
      <div className="two-column">
        <section className="content-card">
          <h2>Human-centric</h2>
          <BulletList items={["Dashboards", "Admin panels", "Manual UI flows"]} />
        </section>
        <section className="content-card">
          <h2>Agent-friendly</h2>
          <BulletList
            items={[
              "Skills",
              "MCPs",
              "CLIs",
            ]}
          />
        </section>
      </div>
    </SimpleSlide>
  );
}

export function AgentsInstructionsSlide() {
  return (
    <SimpleSlide title="AGENTS.md / CLAUDE.md" section="technique">
      <p className="lead technique-lead">Keep always-loaded instructions high signal.</p>
      <div className="skill-format-layout">
        <BulletList
          items={[
            "These files are automatically loaded into the agent context",
            "Keep root instructions high-level: setup, tests, architecture, conventions",
            "Avoid long docs that bloat the context window unnecessarily",
            "In monorepos, add nested AGENTS.md files near specific packages or apps",
          ]}
        />
        <FilePanel filename="repo/AGENTS.md" tone="green">
          <div className="skill-tree" aria-label="Nested agent instruction file structure">
            <p><span>repo/</span> <em>root instructions</em></p>
            <p>├─ <strong>AGENTS.md</strong> <em>high-level defaults</em></p>
            <p>├─ <span>apps/web/</span></p>
            <p className="skill-tree-child">└─ <strong>AGENTS.md</strong> <em>web-specific</em></p>
            <p>└─ <span>packages/api/</span></p>
            <p className="skill-tree-child">└─ <strong>AGENTS.md</strong> <em>api-specific</em></p>
          </div>
        </FilePanel>
      </div>
    </SimpleSlide>
  );
}

export function SkillsTechniqueSlide() {
  return (
    <SimpleSlide title="Skills" section="technique">
      <p className="lead technique-lead">Democratize tribal knowledge through reusable agent skills.</p>
      <div className="skill-format-layout">
        <BulletList
          items={[
            "Turn product learnings and domain knowledge into repository-owned and company-owned skills",
            "If you want to enforce certain pratices then create a SKILL.",
            "Make yourself obsolete by turning the knowledge you hold into skills others can use",
            "Get skill tool will only pull SKILL.md",
            "Use nested skills for package-specific or domain-specific guidance",
          ]}
        />
        <FilePanel filename="skills/customer-debugging/" tone="green">
          <div className="skill-tree" aria-label="Skill directory format">
            <p><span>skills/</span> <em>shared skills</em></p>
            <p>├─ <span>customer-debugging/</span></p>
            <p className="skill-tree-child">├─ <strong>SKILL.md</strong> <em>short entrypoint</em></p>
            <p className="skill-tree-child">└─ <span>references/</span></p>
            <p className="skill-tree-child">&nbsp;&nbsp;&nbsp;└─ runbooks.md</p>
            <p>└─ <span>packages/api/</span></p>
            <p className="skill-tree-child">└─ <span>skills/api-debugging/</span></p>
            <p className="skill-tree-child">&nbsp;&nbsp;&nbsp;└─ <strong>SKILL.md</strong> <em>api-specific</em></p>
          </div>
        </FilePanel>
      </div>
    </SimpleSlide>
  );
}

export function ParallelWorkflowsSlide() {
  return (
    <TechniqueSlide
      title="Useful Workflows"
      technique="Small workflow upgrades that make agents easier to use."
      extra={{
        items: [
          "Git worktrees: run parallel agents on the same repo without branch conflicts",
          "Tmux: keep your terminal setup persistent",
          "STT: You tend to give more context much faster while speaking than by typing",
        ],
      }}
    />
  );
}

export function TmuxOrchestrationSlide() {
  return (
    <TechniqueSlide
      title="Tmux Orchestration"
      technique="Manage multiple agent sessions."
      extra={{
        title: "Use tmux for",
        items: [
          "Multiple terminal panes",
          "Agent session tracking",
          "Test runners",
          "Logs",
          "Servers",
          "Parallel workflows",
        ],
      }}
    />
  );
}

export function SttInputSlide() {
  return (
    <TechniqueSlide
      title="STT for Richer Context"
      technique="Use speech-to-text for richer prompts."
      extra={{
        title: "Useful for quickly explaining",
        items: [
          "Background",
          "Constraints",
          "What you already tried",
          "Expected outcome",
          "Tradeoffs",
          "Risks",
          "Product context",
        ],
      }}
    />
  );
}

export function ClosingSlide() {
  return (
    <TerminalFrame title="closing">
      <div className="closing-slide">
        <p className="closing-kicker">Your harness is the differentiator</p>
        <h1 className="closing-punchline">
          <span className="closing-lane">Better agents</span>
          <span className="closing-bridge">
            <span>come</span>
            <span>from</span>
          </span>
          <span className="closing-lane closing-lane-accent">better harnesses.</span>
        </h1>
        <p className="closing-definition">
          Right tools. Right context. Right direction.<br />
          Right expectations. Optimise time and cost.
        </p>
      </div>
    </TerminalFrame>
  );
}
