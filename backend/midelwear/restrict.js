const { validateToken } = require("../seirvise/autho");
const { LocalStorage } = require("node-localstorage");
const localStorage = new LocalStorage('./scratch');

function checkRole(roles) {
  return function (req, res, next) {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return res.status(401).send('Unauthorized: No token provided');
    }

    let payload;
    try {
      payload = validateToken(token);
      console.log('Payload:', payload);
    } catch (err) {
      console.error('Error validating token:', err.message);
      return res.status(401).send('Unauthorized: Invalid token');
    }

    // Debug the payload structure
    if (!payload) {
      console.error('Payload is undefined or null');
      return res.status(401).send('Unauthorized: Invalid token structure');
    }
    if (!payload.role) {
      console.error('Payload.user is undefined or null');
      return res.status(401).send('Unauthorized: Invalid token structure');
    }
    

    // Check if payload and payload.user exist and if payload.user has a role
    if (roles.includes(payload.role)) {
      return next();
    } else {
      return res.status(403).send('Forbidden: Insufficient role');
    }
  };
}

module.exports = {checkRole} ;
