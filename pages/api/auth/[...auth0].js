import { handleAuth, handleLogin, handleCallback } from '@auth0/nextjs-auth0';

const afterCallback = async (req, res, session, state) => {
  return session
}

export default handleAuth({
  async login(req, res) {
    try {
      await handleLogin(req, res, {
        authorizationParams: {
          audience: process.env.AUTH0_AUDIENCE,
          scope: process.env.AUTH0_SCOPE
        },
        returnTo: "/api/loginHandler"
      });
    } catch (error) {
      res.status(error.status || 400).end(error.message);
    }
  },
  async callback(req, res) {
    try {
      await handleCallback(req, res, { afterCallback });
    } catch (error) {
      res.status(error.status || 500).end(error.message);
    }
  }
})

