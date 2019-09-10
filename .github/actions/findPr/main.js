const core = require('@actions/core');
const { GitHub, context } = require('@actions/github');

async function main() {
    const token = core.getInput('github-token', {required: true})
    const sha = core.getInput('sha') || context.sha;

    const client = new GitHub(token, {});
    const result = await client.repos.listPullRequestsAssociatedWithCommit({commit_sha: sha});

    core.setOutput("pr", `${result.data.length > 0 ? result.data[0].number : ''}`);
}

main().catch(err => core.setFailed(err.message));