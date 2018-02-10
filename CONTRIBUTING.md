# Contributing

When contributing to this repository, please first discuss the change you wish to make by making an issue. 

## First Steps
- Fork the repo
- Clone down your fork
- Set up a remote to track this repo's dev branch `git remote add upstream https://github.com/mikemfleming/ruckus.git`
- Update upstream `git fetch upstream`
- Ruckus uses snyk to find, fix, and monitor vulnerabilities in npm `npm install -g snyk`
- Run `npm install`
- Check your Node version. I use v8.6.0 and recommend using Node Version Manager
- Set up your environment variables

## Configure ESLint
Ruckus uses the AirBnB style guide. 
```
npm i -g eslint eslint-config-airbnb eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-import
```

## Start Working
- Start up your local mongo server `mongod`
- Run `npm start`
- Run `npm run proxy` to have the proxy server forward slack messages to your localhost
- In another window, run `redis-server`
- Take a peek at http://localhost:8888

## Git Workflow
- Find or create an issue in this repo's issues tab to work on, for example: an issue called Add Kittens and numbered 13
- Branch off of your upstream remote `git checkout -b KITTENS-13 -t upstream/dev`
- Add changes and make commits!

## Making a Pull Request
- Rebase your branch `git rebase upstream/dev`
- Run the tests to confirm it's working as expected `npm test`
- Push your changes up to your fork `git push origin KITTENS-13`
- Open a pull request with the follow settings: `base fork: mikemfleming/ruckus base: dev` and `head fork: YOU/ruckus compare: KITTENS-13`
- Add `resolve #13` in your pull request comments to link it to the issue it resolves
