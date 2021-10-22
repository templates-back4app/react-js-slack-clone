# Back4App React Slack Clone

This [React](https://reactjs.org/) app uses [Parse Server](https://parseplatform.org/) through [Back4App](https://www.back4app.com/) to create a Slack clone, with user management, text channels and chat messaging. It also uses the [`@parse/react`](https://github.com/parse-community/parse-react/tree/master/packages/parse-react) hook to enable Live Query and live updates on the app.

## Back4App Setup

Sign up to [Back4App](https://www.back4app.com/) or log in with your existing account. Create a new app utilizing the `back4app/SlackClone` DB from the DatabaseHub, naming it whatever you like it. Let's now retrieve some key values to enable the integration of your Back4App app with this React example.

### Parse Application ID and Parse JavaScript Key

In your Back4App dashboard, navigate to "App Settings -> Security & Keys" and write down the `Application ID` and `JavaScript Key` values.

### Parse Live Query URL

Navigate to "App Settings -> Server Settings -> Server URL and Live Query". Activate your free Back4App subdomain and then activate Live Query, remenbering to activate it on the `Channel` and `Message` classes. Write down the complete Back4App subdomain, as it will be your `Parse Live Query URL` value.

## Local Installation Instructions

Make sure you have [`node`](https://nodejs.org/en/download/) properly installed and configured on your local environment, as well as [`git`](https://git-scm.com/). Clone this repository to your machine using `git` and open the project's code in your favorite code editor.

Create a new file in the project root directory called `.env` with the following content, filling the environmental variables values with your own app information:

```plain
REACT_APP_PARSE_APPLICATION_ID = "YOUR PARSE APPLICATION ID"
REACT_APP_PARSE_JAVASCRIPT_KEY = "YOUR PARSE JAVASCRIPT KEY"
REACT_APP_PARSE_LIVE_QUERY_URL = "YOUR PARSE LIVE QUERY URL"
```

Save the file and run the following commands in your command line to install all project dependencies and finally start the app in development mode on your browser.

```plain
yarn install
yarn start
```

That's it, your Slack clone should be running fine now!

## Vercel Deployment Instructions

If you want to deploy this app using Vercel, fork this repository on GitHub and click on the button below. After being redirect to Vercel, fill your GitHub repository information and also the required environmental variables.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftemplates-back4app%2Freact-js-slack-clone&env=REACT_APP_PARSE_APPLICATION_ID,REACT_APP_PARSE_LIVE_QUERY_URL,REACT_APP_PARSE_JAVASCRIPT_KEY&envDescription=Enter%20your%20Application%20ID%2C%20Javascript%20Key%20and%20Real%20Time%20URL&envLink=https%3A%2F%2Fparse-dashboard.back4app.com%2Fapps&project-name=slack-clone-javascript-template&repository-name=slack-clone-javascript-template)
