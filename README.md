# Storyblok Offline Backup - Plugin

# What is Storyblok?
* Website: https://www.storyblok.com

# How to use?
Either clone this repository and create a .env file in the root directory for the following fields: 
```bash
BASE_URL=http://localhost:3000
CONFIDENTIAL_CLIENT_ID="<CLIENT_ID>"
CONFIDENTIAL_CLIENT_SECRET="<CLIENT_SECRET>"
CONFIDENTIAL_CLIENT_REDIRECT_URI="{ngrokUrl}/auth/callback"
```
and follow the steps in the Storyblok Partner Section for [creating apps](https://www.storyblok.com/tp/how-to-create-custom-app-for-storyblok-with-nuxt-js-and-oauth2) 
or get into your own Storyblok Space and install this application.

# Current Features
- List all available stories in the space where this app has been installed
- Create and download a ZIP Archive (Backup) of the whole space. 

# Upcoming / Planned Features
- Select certain stories for download
- Import a backup created by "sb-offline-backup"

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
