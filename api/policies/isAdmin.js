module.exports = function isAdmin (req, res, next) {

  if ( !req.user || req.user.role != 'admin' ) {
    return res.redirect('/login');
  }

  next();
};