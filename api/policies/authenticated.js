/**
 * Allow any authenticated user.
 */
var error_responses = {
    "authenication_required" : { errorCode: "91", message: "A user access token is required to request this resource. Please log in."}
};
module.exports = function (req, res, ok) {
 
  // User is allowed, proceed to controller
  if (req.isAuthenticated()) return ok();
  // User is not allowed
  else return res.unauthorized(error_responses["authenication_required"]);
};