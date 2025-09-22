import { Mwn } from "mwn"

const bot = await Mwn.init({
  apiUrl: process.env.WIKI_API_URL || "https://azurlane.koumakan.jp/w/api.php",

  // Can be skipped if the bot doesn't need to sign in
  username: process.env.WIKI_USERNAME,
  password: process.env.WIKI_PASSWORD,

  // Instead of username and password, you can use OAuth 2 to authenticate (recommended),
  // if the wiki has Extension:OAuth enabled
  // OAuth2AccessToken: process.env.WIKI_OAUTH2_ACCESS_TOKEN,

  // Or use OAuth 1.0a (also only applicable for wikis with Extension:OAuth)
  // OAuthCredentials: {
  //   consumerToken: process.env.WIKI_OAUTH_CONSUMER_TOKEN,
  //   consumerSecret: process.env.WIKI_OAUTH_CONSUMER_SECRET,
  //   accessToken: process.env.WIKI_OAUTH_ACCESS_TOKEN,
  //   accessSecret: process.env.WIKI_OAUTH_ACCESS_SECRET,
  // },

  // Set your user agent (required for WMF wikis, see https://meta.wikimedia.org/wiki/User-Agent_policy):
  userAgent: process.env.WIKI_USER_AGENT,

  // Set default parameters to be sent to be included in every API request
  defaultParams: {
    assert: "user", // ensure we're logged in
  },
})

console.log(bot)
