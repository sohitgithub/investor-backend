const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const token = bearer[1];
    
    jwt.verify(token, process.env.JWT_SECRET || 'secretkey123', (err, authData) => {
      if (err) return res.status(403).json({ error: "Invalid Token" });
      req.user = authData;
      next();
    });
  } else {
    res.status(403).json({ error: "Token missing" });
  }
};

module.exports = verifyToken;