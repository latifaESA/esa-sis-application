import { getSession } from 'next-auth/react';

const sessionMiddleware = (handler) => async (req, res) => {
  // Retrieve the session
  const session = await getSession({ req });

  if (!session) {
    // If the session doesn't exist
    if (req.method === 'PUT') {
      // If the request method is PUT, return a 401 Unauthorized response
      return res.status(401).json({ message: 'Unauthorized' });
    } else {
      // For other request methods, redirect to the login page
      res.writeHead(307, { Location: '/user/login' });
      return res.end();
    }
  } else {
    // If the session exists, pass control to the next handler
    return handler(req, res);
  }
};

export default sessionMiddleware;
