# Contributing

When contributing to this repository, please first discuss the change you wish to make by making an issue. 

## First Steps
- Fork the repo
- Clone down your fork
- Set up a remote to track this repo's dev branch `git remote add upstream https://github.com/mikemfleming/spot-dawg.git`
- Update upstream `git fetch upstream`
- SD uses snyk to find, fix, and monitor vulnerabilities in npm `npm install -g snyk`
- Run `npm install`
- Check your Node version. I use v8.6.0 and recommend using Node Version Manager
- Set up your environment variables

## Run Tests
- Run the tests `npm test`

## Start Working
- Run `npm start`
- In another window, run `redis-server`
- Take a peek at http://localhost:8888

## Git Workflow
- Find or create an issue in this repo's issues tab to work on, for example: an issue called Add Kittens and numbered 13
- Branch off of your upstream remote `git checkout -b KITTENS-13 -t upstream/master`
- Add changes and make commits
- Rebase `git rebase upstream/master`
- Run the tests `npm test`
- Push your changes `git push origin KITTENS-13`
- Push your branch to github `git push origin KITTENS-13`
- Submit your pull request from your dev branch to ours and add `resolve #13` in your pull request comments
