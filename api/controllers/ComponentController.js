/**
 * ComponentController
 *
 * @description :: Server-side logic for accessing individual components.
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
	/**
	* Download a component.
	*/
	download: function  (req, res) {
		var componentId = req.param("id");
		if (typeof(componentId) == "undefined") return res.badRequest("Component Id Required.");
		Component.findOne({id: componentId}).populate('equation').exec(function(err, component) {
			if (err) return res.badRequest("There was an error loading this component.");
			switch(component.format) {
				case 'svg':
					res.attachment(component.id + ".svg");
              		res.end(component.source, 'UTF-8');
              		break;
              	case 'mml':
              		res.attachment(component.id + ".xml");
              		res.end(component.source, 'UTF-8');
              		break;
              	case 'png':
              		res.send(component.source);
              		break;
              	case 'description':
              		res.send(component.source);
              		break;
              	default:
              		//Er, this would be a problem.
					res.notFound({ errorCode: "30", message: "Component not found: " + componentId });
			}
		});
  	}
};

