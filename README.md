# GitStat

> An API that serves the ✨ top ✨ forked repositories and the most active 👩‍💻 committees 👨‍💻 on them from an organization on GitHub.

### Try the API on Heroku now!

[![Heroku](https://heroku-badge.herokuapp.com/?app=quiet-atoll-37147&root=ping)](https://quiet-atoll-37147.herokuapp.com/org/microsoft?n=2&m=4)

## Getting Started

```sh
# Clone the repo
git clone https://github.com/ajwad-shaikh/GitStat
cd GitStat

# Install dependencies
npm install

# Create .env | Get your token here -> https://github.com/settings/tokens
echo "GITHUB_AUTH_TOKEN=<YOUR_PERSONAL_GITHUB_AUTHENTICATION_TOKEN>" > .env

# Run locally
npm start
```

## API 

- GET **`/org/:orgName?n=N&m=M`**
    - Parameters
        - `orgName` - The organisation for whom you want to query the stats
        - `n` - The API will fetch the top **N** most forked repositories under the organization (default: 1)
        - `m` - The API will fetch the top **M** contributors on each repo on basis of the commits they have made to them. (default: 1)
    - Example
        - https://quiet-atoll-37147.herokuapp.com/org/microsoft?n=2&m=4
        
            Fetches the top 4 contributors on each of the top 2 most forked repositories under the Microsoft organization on GitHub.
            
            Response :
            ```json
            [{"repo":"vscode","url":"https://github.com/microsoft/vscode","forks":16928,"contributors":[{"user":"bpasero","url":"https://github.com/bpasero","contributions":8972},{"user":"joaomoreno","url":"https://github.com/joaomoreno","contributions":7474},{"user":"jrieken","url":"https://github.com/jrieken","contributions":7296},{"user":"mjbvz","url":"https://github.com/mjbvz","contributions":5429}]},{"repo":"TypeScript","url":"https://github.com/microsoft/TypeScript","forks":8759,"contributors":[{"user":"ahejlsberg","url":"https://github.com/ahejlsberg","contributions":3629},{"user":"sheetalkamat","url":"https://github.com/sheetalkamat","contributions":2551},{"user":"mhegazy","url":"https://github.com/mhegazy","contributions":2308},{"user":"DanielRosenwasser","url":"https://github.com/DanielRosenwasser","contributions":2240}]}]
            ```

## Known Limitations

- Constraint on values of `n` and `m`
    ```
    n, m <= 100

    This is due to GitHub API limiting items per page to a maximum of 100, we would have to implement additional pagination support to overcome this limit.
    ```

## Contributing

If you have suggestions for how GitStat could be improved, or want to report a bug, open an issue! I'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[MIT](LICENSE) © 2020 Ajwad Shaikh

Made with :heart: by [Ajwad Shaikh](https://github.com/ajwad-shaikh)