Feature: Error responses
	In order to know when I have made an incorrect call
	As an API user
	I want to be notified of errors with meaningful status codes and messages

Scenario: Invalid file upload type
	Given a ZIP file
	When I ask for an SVG conversion
	Then I should get an error code of 24
	And I should get a status code of 400
	And I should get an error message

Scenario: Invalid request method
	Given an AsciiMath equation
	And a request method of PUT
	When I ask for a text description
	Then I should get a status code of 404

Scenario: Equation lookup by invalid ID
	Given a bogus equation ID
	When I ask for the equation by ID
	Then I should get a status code of 404

Scenario: Unsupported math input type
	Given an English equation
	When I ask for a text description
	Then I should get a status code of 400
	And I should get an error message

Scenario: Unsupported output format
	Given an HTML file containing equations
	When I ask for a JPG conversion
	Then I should get a status code of 400
	And I should get an error message
