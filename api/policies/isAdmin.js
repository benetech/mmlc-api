var error_responses = {
    "admins_only" : { errorCode: "90", message: "An admin user access token is required to request this resource."}
};
module.exports = function isAdmin (req, res, next) {
  if (!req.user) return res.unauthorized(error_responses["admins_only"]);
  else if (req.user.role != 'admin' ) return res.forbidden(error_responses["admins_only"]);
  else return next();
};