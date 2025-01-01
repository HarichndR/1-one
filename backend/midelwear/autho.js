// middleware/autho.js
const { validateToken } = require("../seirvise/autho");
const { LocalStorage } = require("node-localstorage");
const localStorage = new LocalStorage('./scratch');

function checkForAuthenticationCookie(req, res, next) {
  try {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage using the correct key
    

    if (!token) {
      return res.status(401).json({ error: 'Token not provided' });
    }

    // Validate and decode the token
    try{
     const userPayload=validateToken(token)
      req.user = userPayload; // Set user payload in request object
      next(); // Proceed to the next middleware
    }
    catch(error) {
      console.error('Error validating token:', error.message);
      return res.status(401).json({ error: 'Invalid token' });
    };
  
  } catch (error) {
    console.error('Error in checkForAuthenticationCookie middleware:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = checkForAuthenticationCookie;
