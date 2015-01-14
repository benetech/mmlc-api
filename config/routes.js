/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  //'/': {
  //  view: 'homepage'
  //},

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  *  If a request to a URL doesn't match any of the custom routes above, it  *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/
  'get /signUp': {
    controller: 'UserController',
    action: 'signUp'
  },

  'post /equation': {
    controller: 'EquationController',
    action: 'convert'
  },

  'put /equation:id': {
    controller: 'EquationController',
    action: 'update'
  },

  'get /equation/:id': {
    controller: 'EquationController',
    action: 'find'
  },

  'post /equation/svg': {
    controller: 'EquationController',
    action: 'svg'
  },

  'post /equation/png': {
    controller: 'EquationController',
    action: 'png'
  },

  '/login': {
    controller: 'AuthController',
    action: 'login'
  },

  '/logout': {
    controller: 'AuthController',
    action: 'logout'
  },

  '/loggedInUser': {
    controller: 'AuthController',
    action: 'loggedInUser'
  },

  'post /feedback': {
    controller: "FeedbackController",
    action: "create"
  },

  'post /html5': {
    controller: "Html5Controller",
    action: "upload"
  },

  'get /html5/:id': {
    controller: 'Html5Controller',
    action: 'find'
  },

  'get /html5/:id/source': {
    controller: 'Html5Controller',
    action: 'downloadSource'
  },

  'get /html5/:id/output': {
    controller: 'Html5Controller',
    action: 'downloadOutput'
  },

  'get /html5/:id/equations': {
    controller: "Html5Controller",
    action: "equations"
  },

  'get /component/:id': {
    controller: "ComponentController",
    action: "download",
    locals: {
      layout: null
    }
  },

  /** Admin pages. */
  '/admin': {
    controller: "AdminController",
    action: "index",
    locals: {
      layout: 'admin/layout'
    }
  },

  'get /admin/equation': {
    controller: 'AdminController',
    action: 'equation',
    locals: {
      layout: null
    }
  },

  'get /admin/feedback': {
    controller: "AdminController",
    action: "feedback",
    locals: {
      layout: null
    }
  },

  'get /admin/equations': {
    controller: "AdminController",
    action: "equations",
    locals: {
      layout: null
    }
  },

  'get /admin/html5uploads': {
    controller: "AdminController",
    action: "html5uploads",
    locals: {
      layout: null
    }
  },

  'get /admin/html5': {
    controller: 'AdminController',
    action: 'html5',
    locals: {
      layout: 'admin/layout'
    }
  },

  'get /myEquations': {
    controller: 'EquationController',
    action: 'myEquations'
  },

  'get /myUploads': {
    controller: 'Html5Controller',
    action: 'myUploads'
  }

  
};
