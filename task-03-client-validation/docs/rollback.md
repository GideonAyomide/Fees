# Rollback Without Hallucination: Deterministic Git Reversion

## 1. Context & Objective
When a developer introduces a change that breaks production or compromises architecture, asking an AI agent in natural language to *"undo what you just did"* or *"revert the last feature"* is one of the most dangerous anti-patterns in modern software engineering.

Natural language is ambiguous. The agent must guess which files to touch, reconstruct deleted code from context window memory, and reconcile edits made across multiple steps. The result is almost always hallucination: subtle bugfixes are wiped out, unrelated files are overwritten, and broken imports are left behind.

In Step 9 of Task Three, we demonstrate how to roll back deterministically using Git's content-addressed object database.

---

## 2. Commit Identification & History Audit

To roll back cleanly, we listed recent commits with their exact SHA identifiers:

```bash
$ git log --oneline -n 6
2c78d63 feat(bad-idea): introduce unvalidated backdoor for rapid testing
5497474 docs(task-02): complete all 20 evidence artifacts and finalize task two deliverables
0a76001 chore(task-02): sync neon configuration and evidence log formatting
1e626b0 docs(task-02): complete task 2 documentation, defects log, and 15 interview answers
85128fa docs(task-02): add git log graph evidence and standalone information design capture screens
45fc7c7 Merge pull request #1 from feature/information-design: Implement Step 10 Information Design & Responsive Type
```

* **Target Commit ID**: `2c78d63`
* **Defect Introduced**: An unvalidated backdoor file (`regretted-change.txt`) intended for rapid testing that bypassed production safety rules.

---

## 3. Rollback Command Executed

Rather than asking the agent to reconstruct the file or run destructive resets (`git reset --hard`), we executed an atomic Git revert targeting the exact commit SHA:

```bash
$ git revert 2c78d63 --no-edit
[main 1beb9c6] Revert "feat(bad-idea): introduce unvalidated backdoor for rapid testing"
 1 file changed, 1 deletion(-)
 delete mode 100644 regretted-change.txt
```

---

## 4. Why Naming the Specific ID Is Safer Than Describing the Change in Words

Naming the specific commit SHA is deterministic and mathematically precise: Git calculates the exact inverse diff of that targeted snapshot and creates an atomic compensating commit without touching unrelated code.

In contrast, asking an agent in words to "undo the last change" invites hallucination: the model reconstructs state from memory, frequently overwriting unrelated edits, dropping adjacent hotfixes, or leaving behind phantom orphan variables.

