import {writeFile} from "node:fs/promises";
import {resolve} from "node:path";

const githubToken = process.env.GITHUB_TOKEN;
const githubUsername = process.env.GITHUB_USERNAME;

if (!githubToken) {
  throw new Error("GITHUB_TOKEN is required to sync the GitHub profile snapshot.");
}

if (!githubUsername) {
  throw new Error(
    "GITHUB_USERNAME is required to sync the GitHub profile snapshot."
  );
}

const response = await fetch("https://api.github.com/graphql", {
  body: JSON.stringify({
    query: `
      {
        user(login: "${githubUsername}") {
          name
          bio
          isHireable
          avatarUrl
          location
          pinnedItems(first: 6, types: [REPOSITORY]) {
            totalCount
            edges {
              node {
                ... on Repository {
                  name
                  description
                  forkCount
                  stargazers {
                    totalCount
                  }
                  url
                  id
                  diskUsage
                  primaryLanguage {
                    name
                    color
                  }
                }
              }
            }
          }
        }
      }
    `
  }),
  headers: {
    Authorization: `Bearer ${githubToken}`,
    "Content-Type": "application/json",
    "User-Agent": "erdogan-portfolio-sync"
  },
  method: "POST"
});

if (!response.ok) {
  throw new Error(`GitHub snapshot sync failed with status ${response.status}.`);
}

const payload = await response.text();

await writeFile(
  resolve("src/features/github/data/profile-snapshot.json"),
  payload
);

console.log("Saved snapshot to src/features/github/data/profile-snapshot.json");
