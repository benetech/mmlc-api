/**
 * Allow any authenticated user.
 */
module.exports = function (req, res, ok) {
 
  // User is allowed, proceed to controller
  var is_auth = req.isAuthenticated()
  if (is_auth) return ok();
  // User is not allowed
  else return res.redirect("/login");
};