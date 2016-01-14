Feature: Converting equations of different input formats
	In order to create accessible math equations
	As an API user
	I want to be able to submit equations in different formats
	and get back equations converted to accessible formats
	
Background:
	Given a user registered with a random username
	
Scenario: Convert AsciiMath to text description
	Given an AsciiMath equation
	When I ask for a text description
	Then I should get back a description of the equation

Scenario: Retrieve a converted equation
	Given a converted equation
	When I ask for the equation by ID
	Then I should get back a full conversion description

Scenario: Retrieve one component of a converted equation
	Given a converted equation
	When I ask for the first component by ID
	Then I should get back a full component description

Scenario: Provide feedback on a converted equation
	Given a converted equation
	When I provide feedback on the equation
	Then I should get back a structure containing the feedback

Scenario: Convert an HTML file to SVG equations
	Given an HTML file containing equations
	When I ask for an SVG conversion
	Then I should get back a confirmation of SVG output
	