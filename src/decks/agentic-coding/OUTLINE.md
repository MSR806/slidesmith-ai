## **Slide 1 — Title**

**Agentic Coding: Harness & Optimisation**  
**Subtitle:** Last year was model capability. This year is harness.

**Speaker notes:**  
Today’s focus is not “which model is smartest?” Most models are already capable. The real question is how we harness them well for engineering work.

---

## **Slide 2 — Why This Matters**

**Content:**

- Models can already do a lot of SE work
- But results depend on how we use them
- Bad harness = slow, costly, inconsistent
- Good harness = faster, cheaper, more reliable

**Speaker notes:**  
A powerful model without context and tools is just expensive autocomplete. The advantage now comes from workflow design.

---

## **Slide 3 — How Agents Actually Work**

**Content:**

- Every message adds to context
- Tool calls use conversation history
- Filesystem, terminal, MCPs, plugins = tools
- Agent quality depends on what it can see and do

**Speaker notes:**  
Agents are loops around LLMs. They read context, decide next action, call tools, observe results, and continue.

---

## **Slide 4 — The Token Problem**

**Content:**

```text
10k → 13k → 20k → 24k → ...
```

- Context grows cumulatively
- Tool calls add more tokens
- Output tokens are expensive
- Cost becomes visible later

**Speaker notes:**  
Every correction, failed attempt, and tool result stays in history. This affects cost, latency, and sometimes quality.

---

## **Slide 5 — Core Framework**

**Content:**  
Good agentic coding needs:

1. Right Context
2. Right Tools
3. Right Direction
4. Right Expectation

Optimisation means reducing:

5. Time
6. Cost

**Speaker notes:**  
Every technique we discuss should map back to these six principles.

---

## **Slide 6 — Plan First**

**Content:**  
**Technique:** Ask agent to plan before acting.

**Helps with:**

- Right Direction
- Right Expectation
- Right Context
- Saves Time
- Saves Cost

**Speaker notes:**  
Planning is cheap. Wrong implementation is expensive. Ask the agent to inspect, propose a plan, mention risks, and wait before editing.

---

## **Slide 7 — Ask Me Questions**

**Content:**  
**Technique:** Let agent surface ambiguity upfront.

**Helps with:**

- Right Context
- Right Direction
- Right Expectation
- Saves Time
- Saves Cost

**Speaker notes:**  
A good agent should not silently assume important things. But ask it to ask only meaningful questions, otherwise it can slow things down.

---

## **Slide 8 — Bring Your Own Approach**

**Content:**  
**Technique:** Don’t let the model’s first framing become default.

**Helps with:**

- Right Context
- Right Direction
- Right Expectation
- Saves Time
- Saves Cost

**Speaker notes:**  
The agent brings execution power. We bring judgment, product context, system history, and tradeoff awareness.

---

## **Slide 9 — Agents.md / Claude.md**

**Content:**  
**Technique:** Repo-level instructions for agents.

Include:

- Setup commands
- Test commands
- Code conventions
- Architecture notes
- PR expectations
- Common pitfalls

**Helps with:**

- Right Context
- Right Direction
- Right Expectation
- Saves Time
- Saves Cost

**Speaker notes:**  
This is onboarding documentation written for agents. It reduces repeated explanation.

---

## **Slide 10 — MCPs / Plugins**

**Content:**  
**Technique:** Connect agents to live systems.

Examples:

- GitHub
- Linear/Jira
- Slack
- DB
- Sentry
- Internal APIs

**Helps with:**

- Right Tools
- Right Context
- Saves Time
- Can increase cost if overused

**Speaker notes:**  
Without tools, agents guess. With tools, they inspect and validate. But unused MCPs still add overhead, so keep only relevant ones enabled.

---

## **Slide 11 — Skills**

**Content:**  
**Technique:** Convert tribal knowledge into reusable agent knowledge.

Examples:

- Release process
- Debugging playbooks
- Testing conventions
- Service architecture
- Migration patterns

**Helps with:**

- Right Context
- Right Tools
- Right Direction
- Right Expectation
- Saves Time
- Saves Cost

**Speaker notes:**  
Today new joiners ask senior people. Agents cannot do that. Skills make team knowledge persistent and reusable.

---

## **Slide 12 — Slash Commands**

**Content:**  
**Technique:** Reusable workflows.

Examples:

```text
/plan
/review-pr
/debug
/write-tests
/check-risk
/create-pr-summary
```

**Helps with:**

- Right Direction
- Right Expectation
- Right Context
- Saves Time
- Saves Cost

**Speaker notes:**  
Slash commands turn good prompts into repeatable team workflows.

---

## **Slide 13 — Subagents**

**Content:**  
**Technique:** Use focused agents for focused tasks.

Examples:

- Debug agent
- Test writer
- Code reviewer
- Security reviewer
- Documentation agent

**Helps with:**

- Right Context
- Right Tools
- Right Direction
- Saves Time
- Can increase cost

**Speaker notes:**  
Subagents are useful for focus and parallelism, but unmanaged subagents can multiply token usage.

---

## **Slide 14 — Model Selection**

**Content:**  
**Technique:** Use the right model for the task.

- Simple edits → smaller/faster model
- Boilerplate → cheaper model
- Debugging → stronger model
- Architecture → reasoning model
- Critical review → stronger model

**Helps with:**

- Right Expectation
- Saves Time
- Saves Cost

**Speaker notes:**  
You do not need the strongest model for every task. Use expensive reasoning where judgment matters.

---

## **Slide 15 — Manage Context**

**Content:**  
**Techniques:**

- Undo bad messages
- Start new session when task changes
- Compact long sessions
- Avoid mistake → correction → mistake loops

**Helps with:**

- Right Context
- Right Direction
- Saves Time
- Saves Cost

**Speaker notes:**  
Context is not just memory. It is also baggage. Bad history can confuse the agent.

---

## **Slide 16 — Build for Agents**

**Content:**  
**Technique:** Build tools agents can use directly.

Instead of only:

- Dashboards
- Admin panels
- Manual UI flows

Also provide:

- APIs
- CLIs
- MCPs
- Structured logs
- Queryable data

**Helps with:**

- Right Tools
- Right Context
- Saves Time
- Saves Cost

**Speaker notes:**  
Dashboards are human-centric. Agents work better with direct, structured interfaces.

---

## **Slide 17 — Parallel Workflows**

**Content:**  
**Techniques:**

- Separate git worktrees
- Multiple agents in parallel
- Tmux for orchestration
- Separate panes for tests, logs, agents

**Helps with:**

- Right Tools
- Right Direction
- Saves Time
- Can increase cost

**Speaker notes:**  
Parallelism is powerful when work is isolated. Without isolation, it becomes chaos.

---

## **Slide 18 — STT for Richer Input**

**Content:**  
**Technique:** Use speech-to-text for richer prompts.

Good for explaining:

- Background
- Constraints
- What was already tried
- Expected outcome
- Risks
- Tradeoffs

**Helps with:**

- Right Context
- Right Direction
- Saves Time

**Speaker notes:**  
Sometimes the bottleneck is not model intelligence. It is how much useful context we are willing to type.

---

## **Slide 19 — Master Mapping**

**Content:**

|**Technique**|**Context**|**Tools**|**Direction**|**Expectation**|**Time**|**Cost**|
|---|---|---|---|---|---|---|
|Plan first|✅||✅|✅|✅|✅|
|Ask questions|✅||✅|✅|✅|✅|
|Agents.md|✅||✅|✅|✅|✅|
|MCPs|✅|✅|||✅|⚠️|
|Skills|✅|✅|✅|✅|✅|✅|
|Slash commands|✅||✅|✅|✅|✅|
|Subagents|✅|✅|✅||✅|⚠️|
|Model selection|||✅|✅|✅|✅|
|Compact sessions|✅||✅||✅|✅|

**Speaker notes:**  
This is the main takeaway: every practice is useful only because it improves one or more of these fundamentals.

---

## **Slide 20 — Closing**

**Content:**  
**Agentic coding is not about replacing engineers.**  
It is about amplifying engineering judgment.

Final line:

**Last year was model capability.** **This year is harness and optimisation.**

**Speaker notes:**  
The engineer still decides what matters, what is risky, and what tradeoffs are acceptable. The agent gives speed and leverage, but only if we build the right harness.