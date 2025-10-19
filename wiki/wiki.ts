import { Mwn } from "mwn"

const api = new Mwn({
  apiUrl: process.env.WIKI_API_URL,
  username: process.env.WIKI_USERNAME,
  password: process.env.WIKI_PASSWORD,
  userAgent: process.env.WIKI_USER_AGENT,
})

const main = async () => {
  try {
    await api.login()
    const userInfo = await api.userinfo()
    console.log("Logged in successfully")
    console.log(userInfo)
  } catch (err) {
    console.error("Login failed:", err)
  }
}

main()
