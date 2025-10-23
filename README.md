# aguilita1/github-script-post-comment

This action extends `actions/github-script` and makes it easy to quickly write
a script in your workflow that uses the GitHub API and the workflow run context
then posts comment to Pull Request and GitHub Summary.

### This action 

To use this action, provide an input named `script` that contains the body of an asynchronous JavaScript function call.
The following arguments will be provided:

- `github` A pre-authenticated
  [octokit/rest.js](https://octokit.github.io/rest.js) client with pagination plugins
- `context` An object containing the [context of the workflow
  run](https://github.com/actions/toolkit/blob/main/packages/github/src/context.ts)
- `core` A reference to the [@actions/core](https://github.com/actions/toolkit/tree/main/packages/core) package
- `glob` A reference to the [@actions/glob](https://github.com/actions/toolkit/tree/main/packages/glob) package
- `io` A reference to the [@actions/io](https://github.com/actions/toolkit/tree/main/packages/io) package
- `exec` A reference to the [@actions/exec](https://github.com/actions/toolkit/tree/main/packages/exec) package
- `require` A proxy wrapper around the normal Node.js `require` to enable
  requiring relative paths (relative to the current working directory) and
  requiring npm packages installed in the current working directory. If for
  some reason you need the non-wrapped `require`, there is an escape hatch
  available: `__original_require__` is the original value of `require` without
  our wrapping applied.

Since the `script` is just a function body, these values will already be
defined, so you don't have to import them (see examples below). You script must
return a `string` that will be included in comment on Pull Request and GitHub
Summary.

See [actions/github-script](https://github.com/marketplace/actions/github-script) for 
documentation.

## Inputs

| Input  | Required | Description                                           |
|--------|----------|-------------------------------------------------------|
| script | Yes      | JavaScript code to execute.                            |
| label  | No       | Label to identify the type of comment (e.g. "lint"). |

*WARNING*: Actions expressions are evaluated before the `script` is passed to the action, so the result of any expressions *will be evaluated as JavaScript code*.

It's highly recommended to *not* evaluate expressions directly in the `script` to avoid
[script injections](https://docs.github.com/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions#understanding-the-risk-of-script-injections)
and potential `SyntaxError`s when the expression is not valid JavaScript code (particularly when it comes to improperly escaped strings).

## Usage example

This examples will retrieve `coverage/coverage-summary.json` results from prior task and pretty print test coverage results to GitHub pull request (if exists) and GitHub Summary. The `label` is used to provide logging context.

```yaml
- name: Add Test Coverage Comment on PR and GitHub Summary
  uses: aguilita1/github-script-post-comment@v1
  env:
    JEST_THRESHOLD_LINES: 75
  with:
    label: "Test Coverage"
    script: |
      const fs = require('fs');
      const thresholdLines = parseInt(process.env.JEST_THRESHOLD_LINES, 10);
      if (isNaN(thresholdLines)) {
          throw new Error('JEST_THRESHOLD_LINES environment variable is not set or invalid');
      }

      const coverage = JSON.parse(fs.readFileSync('coverage/coverage-summary.json'));
      const pct = Math.round(coverage.total.lines.pct);
      const status = pct >= thresholdLines ? '✅' : '❌';

      let body = `## Test Coverage Report ${status}\n\n`
          + `**Coverage Found:** ${pct}%\n`
          + `**Expected:** ${thresholdLines}%\n\n`
          + `- Lines: ${coverage.total.lines.pct}%\n`
          + `- Functions: ${coverage.total.functions.pct}%\n`
          + `- Branches: ${coverage.total.branches.pct}%\n`
          + `- Statements: ${coverage.total.statements.pct}%`;

      return body;
```