require("dotenv").config();
var express = require("express");
var app = express();
const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
  auth: process.env.GITHUB_AUTH_TOKEN,
});

app.get("/org/:orgName", (req, res) => {
  const orgName = req.params.orgName;
  const n = req.query.n;
  const m = req.query.m;
  octokit.search
    .repos({
      q: `org:${orgName}`,
      sort: "forks",
      order: "desc",
      per_page: n,
      page: 1,
    })
    .then(({ data }) => {
      const topRepos = data.items;
      var totalRepos = topRepos.length;
      var returnData = new Array(totalRepos);
      var doneRepos = 0;
      var getContributors = new Promise((resolve, reject) => {
        topRepos.forEach((repo, index) => {
          let repoData = {
            repo: repo.name,
            url: repo.html_url,
            forks: repo.forks_count,
          };
          octokit.repos
            .listContributors({
              owner: orgName,
              repo: repo.name,
              per_page: m,
              page: 1,
            })
            .then((contributors) => {
              repoData.contributors = new Array(contributors.data.length);
              contributors.data.forEach((contributor, index) => {
                repoData.contributors[index] = {
                  user: contributor.login,
                  url: contributor.html_url,
                  contributions: contributor.contributions,
                };
              });
              returnData[index] = repoData;
              doneRepos += 1;
              if (doneRepos === totalRepos) {
                resolve();
              }
            });
        });
      });
      getContributors.then(() => res.json(returnData));
    })
    .catch((error) => {
      res.json(error);
    });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
