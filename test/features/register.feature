Feature: User registration
	In order to allow people to keep track of their own MathML conversions
	As an API user
	I want to be able to register for an account
	
Scenario: Register as an individual user
	Given a random username and password
	And a standard firstname and lastname
	When I register as a new user
	Then I should get a successful response

Scenario: Register as a user at an organization
	Given a random username and password
	And a standard firstname and lastname
	And an organization name of 'Benetech'
	When I register as a new user
	Then I should get a successful response
	And the response should contain the organization name

Scenario: Register as a user at a specific type of organization
	Given a random username and password
	And a standard firstname and lastname
	And an organization name of 'Benetech'
	And an organization type of 'K-12 Education'
	When I register as a new user
	Then I should get a successful response
	And the response should contain the organization type

Scenario: Register without required information
	Given a standard firstname and lastname
	When I register as a new user
	Then I should get an error response
	And the response should indicate missing fields

Scenario: Register with an existing username
	Given a user registered with a random username
	When I register with the same username
	Then I should get an error response
	And the response should indicate that username is taken
	