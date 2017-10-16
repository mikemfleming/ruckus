# Contributing

When contributing to this repository, please first discuss the change you wish to make by making an issue. 

## Cloning the Repo
- Clone the repo
- Run `npm install`
- Check your Node version. I use v8.6.0 and recommend using Node Version Manager
- Contact an admin for instructions on setting up environment variables
- Run the tests `npm test`

## Getting Started
- Run `npm start`
- In another window, run `redis-server`

## Git Workflow
- Find or create an issue to work on, for example an issue called Add Kittens and numbered 13
- Branch off of your local dev branch `git checkout -b KITTENS-13 remotes/origin/dev`
- Add changes and make commits locally
- Push your branch to github `git push origin KITTENS-13`
- Submit your pull request to dev and add `resolve #13` in your pull request comments
