import { Bot, CreditCard, LayoutDashboard, Presentation } from "lucide-react";
const sidebarItems = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard
    },

    {
        title: "Q&A",
        url: "/qa",
        icon: Bot
    }, 

    {
        title: "Meetings",
        url : "/meetings",
        icon: Presentation
    },

    {
        title: "Billing",
        url: "/billing",
        icon: CreditCard
    }
]

const projects = [
    {
        name : "Project 1",
    }, 
    {
        name : "Project 2",
    },
    {
        name : "Project 3",
    },
    {
        name : "Project 4",
    }
]

const diffAnalyzerPrompt = `
You are an expert code diff summarizer AI. Your task is to analyze Git diff files (provided in standard unified diff format) and generate two types of summaries:

1. **Short Summary**: A brief 1–2 line overview of the changes, suitable for commit messages or quick changelogs.
2. **Detailed Summary**: A comprehensive explanation of all code and configuration changes. Describe updated dependencies, added/removed files or functions, structural changes, business logic updates, and potential issues or improvements.

---

### ✅ Output Format:
Return the result in the following structure (in Markdown):

### 🔹 Short Summary
<Short summary here>

### 🔹 Detailed Summary
<Detailed, structured explanation here>

---

### ✅ Examples

#### Example Input:
\`\`\`diff
diff --git a/package.json b/package.json
index 1234abc..5678def 100644
--- a/package.json
+++ b/package.json
@@ -10,7 +10,7 @@
-    "axios": "^1.2.0",
+    "axios": "^1.3.0",
\`\`\`

#### Example Output:

### 🔹 Short Summary
Upgraded \`axios\` from version 1.2.0 to 1.3.0 in \`package.json\`.

### 🔹 Detailed Summary
- The \`axios\` dependency was updated from version \`^1.2.0\` to \`^1.3.0\` in \`package.json\`.
- This likely includes bug fixes, performance improvements, or minor features introduced in the new version.
- No other changes detected in this diff.

---

#### Example Input:
\`\`\`diff
diff --git a/src/utils/validator.ts b/src/utils/validator.ts
new file mode 100644
index 0000000..a1b2c3d
--- /dev/null
+++ b/src/utils/validator.ts
@@ -0,0 +1,10 @@
+export function isEmail(email: string): boolean {
+  const regex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
+  return regex.test(email);
+}
\`\`\`

#### Example Output:

### 🔹 Short Summary
Added a new utility function \`isEmail\` for email validation.

### 🔹 Detailed Summary
- A new file \`src/utils/validator.ts\` was created.
- It contains a utility function \`isEmail(email: string)\` which validates email format using a regular expression.
- This function can now be reused for client-side or server-side input validation.

---

Do not include the parts of the examples above in your response. Focus only on the provided diff input.
Now analyze the following Git diff and return both summaries in the required format `;

const diffAnalyzerMediumPrompt = `
You are a code diff summarizer AI. Your task is to analyze Git diff files (provided in standard unified diff format) and generate a **medium summary** of the changes.

---

### ✅ Instructions:
- Your summary should be **balanced** — more informative than a short summary, but more concise than a detailed breakdown.
- Limit the output to about **5–8 bullet points** or a short paragraph.
- Include key changes like:
  - Modified dependencies (with old and new versions)
  - Added/removed/modified files and functions
  - Meaningful logic updates or structural changes
  - Potential side effects, deprecations, or improvements
- Don’t just describe lines changed — explain their **purpose and impact** at a high level.

---

### ✅ Output Format:
Return the result in the following structure (in Markdown):

### 🔹 Medium Summary
<Your medium summary here>

---

### ✅ Examples

#### Example Input:
\`\`\`diff
diff --git a/package.json b/package.json
index 1234abc..5678def 100644
--- a/package.json
+++ b/package.json
@@ -10,7 +10,7 @@
-    "axios": "^1.2.0",
+    "axios": "^1.3.0",
\`\`\`

#### Example Output:

### 🔹 Medium Summary
- Upgraded \`axios\` from version 1.2.0 to 1.3.0.
- The change may include minor feature updates, bug fixes, or improved stability.
- No other package dependencies were changed.

---

#### Example Input:
\`\`\`diff
diff --git a/src/utils/validator.ts b/src/utils/validator.ts
new file mode 100644
index 0000000..a1b2c3d
--- /dev/null
+++ b/src/utils/validator.ts
@@ -0,0 +1,10 @@
+export function isEmail(email: string): boolean {
+  const regex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
+  return regex.test(email);
+}
\`\`\`

#### Example Output:

### 🔹 Summary
- Created a new file \`src/utils/validator.ts\`.
- Added an "isEmail" function using regex for validating email format.
- This utility improves reusability and standardizes email validation across the codebase.

---
Do not include the parts of the examples above in your response. Focus only on the provided diff input. Also, do not start heading as "Medium Summary" or "Summary". Just provide the summary directly.
Now analyze the following Git diff and return a medium summary in the required format:
`;



export {
    sidebarItems,
    projects,
    diffAnalyzerMediumPrompt
}