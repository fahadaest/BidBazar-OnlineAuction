// authMiddleware.js

const authMiddleware = (req, res, next) => {
    if (req.session.logged_in) {
      // User is logged in, continue to the next middleware or route handler
      next();
    } else {
      // User is not logged in, send an error response or redirect to login
      res.render('signin',{ alert: true,
        type: 'alert-success text-center',
        message: 'Sign in first to create bid' })
    }
  };
  
module.exports = authMiddleware;
  