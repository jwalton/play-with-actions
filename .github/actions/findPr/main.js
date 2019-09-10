const core = require('@actions/core');
const { GitHub, context } = require('@actions/github');

async function main() {
    const token = core.getInput('github-token', {required: true})
    const sha = core.getInput('sha');

    let pr;
    if (!sha && context.eventName === 'pull_request') {
        pr = context.payload.pull_request.number;
    } else {
        // If this is not a pull_request event, there might still be a PR associated with the SHA.
        const client = new GitHub(token, {});
        const result = await client.repos.listPullRequestsAssociatedWithCommit({
            owner: context.repo.owner,
            repo: context.repo.repo,
            commit_sha: sha || context.sha
        });

        pr = result.data.length > 0 && result.data[0].number;
    }

    core.setOutput("pr", pr || '');
}

main().catch(err => core.setFailed(err.message));