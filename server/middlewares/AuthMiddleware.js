// creating a function to verify the token
import jwt from "jsonwebtoken";

export const verifyToken = (request, response, next) => {
  // getting the token from the request cookies
  // console.log("Cookies: ", request.cookies);
  const token = request.cookies.jwt;
  // console.log("Token: ", token);

  // if we don't have a token
  if (!token) {
    return response.status(401).send("You are not authenticated");
  }

  // if we have token
  jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
    if (err) {
      // if the token is not proper
      return response.status(403).send("The token is not valid!");
    }

    // else store userId
    request.userId = payload.userId;

    //hop into next middleware that is our getUserInfo function
    next();
  });
};
