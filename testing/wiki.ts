import { Mwn } from 'mwn';

const api = new Mwn({
  apiUrl: process.env.WIKI_API_URL!,
  username: process.env.WIKI_USERNAME!,
  password: process.env.WIKI_PASSWORD!,
  userAgent: process.env.WIKI_USER_AGENT!,
});

async function main() {
  try {
    await api.login();
    const userInfo = await api.userinfo();
    console.log('Logged in successfully as', userInfo.name);
  } catch (err) {
    console.error('Login failed:', err);
  }
}

main();