require("dotenv").config();
var express = require("express");
var app = express();
const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
  auth: process.env.GITHUB_AUTH_TOKEN,
  /*  
  *   Unauthenticated requests to the GitHub API are rate-limited at 60 requests/hour
  *   In order to get a higher rate-limit (5000 requests/hour), we have to add 
  *   Authentication Parameters to the request to get the same. 
  *   You can set GITHUB_AUTH_TOKEN in our .env file or the deploy environment.
  *   Get your personal authentication token here -> https://github.com/settings/tokens
  */
});

const PORT = process.env.PORT || 8080; // Heroku defines the suitable PORT as an environment variable

app.get("/org/:orgName", (req, res) => {
  const orgName = req.params.orgName;
  const n = req.query.n ? req.query.n : 1;
  const m = req.query.m ? req.query.m : 1;
  octokit.search
    .repos({
      q: `org:${orgName}`,  // scope search within the organization
      sort: "forks",        // sort by number of forks on the repo
      order: "desc",        // start from the most forked repo
      per_page: n,          // take `n` results only
      page: 1,              // take 1st page only
    })
    .then(({ data }) => {
      const topRepos = data.items;                      // returns list of repos 
      var totalRepos = topRepos.length;
      var returnData = new Array(totalRepos);           // Initialize array to return our response
      var doneRepos = 0;                                // Repos for whom we have fetched contributors' data
      var getContributors = new Promise((resolve) => {
        /*  
        *   Resolves Promise when all async processes in
        *   forEach loop are executed to ensure response 
        *   is complete
        */
        topRepos.forEach((repo, index) => {
          let repoData = {
            repo: repo.name,
            url: repo.html_url,
            forks: repo.forks_count,
          };
          octokit.repos
            .listContributors({
              owner: orgName,           // organisation
              repo: repo.name,          // repository 
              per_page: m,              // `m` contributors (sorted by no. of commits by default)
              page: 1,                  // just the first page
            })
            .then((contributors) => {
              repoData.contributors = new Array(contributors.data.length);  // Init array to hold contributors data for each repo
              contributors.data.forEach((contributor, index) => {
                repoData.contributors[index] = {                  // index assigned to keep sorted order
                  user: contributor.login,                        // GitHub username of the contributor
                  url: contributor.html_url,                      // GitHub profile URL
                  contributions: contributor.contributions,       // Number of commits made on the repo
                };
              });
              returnData[index] = repoData; // index assigned to keep sorted order as async processes might not finish sequentially
              doneRepos += 1;               // increments number of repos that we are done fetching contributors' data for
              if (doneRepos === totalRepos) {
                // Resolve Promise if all repositories data is fetched and response is ready to be sent. 
                resolve();
              }
            });
        });
      });
      getContributors.then(() => res.status(200).json(returnData)); // once async processes are finished, return response.
    })
    .catch((error) => {
      console.error(error)                      // will help with debugging 
      res.status(400).json("Bad Request");      // return `Bad Request` status code
    });
});

app.get("/ping", (req, res) => {
  res.status(200).json("Pong! GitStat is live ✅")    // ping endpoint to check availability
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); // start running server on PORT set by environment variable
});
