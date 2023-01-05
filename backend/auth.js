// import jwt
const jwt = require('jsonwebtoken');

// import the db interactions module
const dbLib = require('./mongodb');

/**
 * autheticates a user by decoding the JWT
 * @returns true if the user is valid
 */
const authenticateUser = async (token, key) => {
  // check the params
  if (token === null || key === null || !key) {
    return false;
  }
  try {
    const decoded = jwt.verify(token, key);
    // verify the user
    const user = await dbLib.getUser(decoded._id);
    console.log('user', user);
    // check the user
    if (!user) {
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
};

module.exports = { authenticateUser };

// await auth.authenticateUser(req.headers.authorization, secret)
