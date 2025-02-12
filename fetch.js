const fs = require("fs");
const https = require("https");
require("dotenv").config();

const GITHUB_TOKEN =
  process.env.REACT_APP_GITHUB_TOKEN || process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME;

if (!GITHUB_USERNAME) {
  throw new Error(
    "GitHub Username is undefined. Please set an environment variable."
  );
}

if (!GITHUB_TOKEN) {
  throw new Error(
    "GitHub Token is undefined. Please set an environment variable."
  );
}

console.log(`Fetching profile for ${GITHUB_USERNAME}`);

const data = JSON.stringify({
  query: `
    {
      user(login: "${GITHUB_USERNAME}") { 
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
});

const defaultOptions = {
  hostname: "api.github.com",
  path: "/graphql",
  port: 443,
  method: "POST",
  headers: {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    "User-Agent": "Node", // GitHub requires a user-agent
    "Content-Type": "application/json"
  }
};

const req = https.request(defaultOptions, res => {
  let responseData = "";

  console.log(`statusCode: ${res.statusCode}`);
  if (res.statusCode !== 200) {
    throw new Error(
      "Request to GitHub did not succeed. Check your GitHub Token or query."
    );
  }

  res.on("data", chunk => {
    responseData += chunk;
  });

  res.on("end", () => {
    // Optionally, parse and check for GraphQL errors:
    // const parsed = JSON.parse(responseData);
    // if (parsed.errors) { console.error(parsed.errors); }

    fs.writeFile("./public/profile.json", responseData, err => {
      if (err) {
        console.error("Error writing file:", err);
      } else {
        console.log("Saved file to public/profile.json");
      }
    });
  });
});

req.on("error", error => {
  throw error;
});

req.write(data);
req.end();
