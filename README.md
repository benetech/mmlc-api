## MathMLCloud

MathMLCloud is an open-source tool to help content developers and technology developers deliver accessible math. It converts math expressions from AsciiMath or LaTex to accessible MathML, text descriptions, SVGs and PNGs.

For more background on the project, [visit the Benetech site](http://benetech.org/our-programs/literacy/born-accessible/mathml-cloud/).

### Getting Started

MathMLCloud API is a [Sails](http://sailsjs.org) app that runs in a Docker-defined environment.

Dependencies:

  - Docker and VirtualBox. See https://docs.docker.com/ for installation instructions.

### Installation

```
git clone https://github.com/openstax/mathmlcloud.git yourProjectName
cd yourProjectName
docker-compose up

# You may need to CTRL+C because mongo did not initialize quickly enough
docker-compose up

# Test to make sure it works:
curl -X POST -d "math=a*b" -d "mathType=AsciiMath" -d "png=true" -d "description=true" http://localhost:1337/equation
```

This will start the containers that make up the app. The application container runs "sails lift" as its command.

The API should be running at http://localhost:1337.

### Users

The app can be used to convert equations from anonymous users, but also supports creating registered users, and has administrative features available to users with an admin role.

#### Anonymous Users

Anyone can use the API to convert individual equations or upload HTML files of equations, but the results are only available at the time of the conversion. To be able to retrieve past conversions, you must be a registered user.

#### Registered Users

Anyone can register with the app by providing their username and a password, along with optional information about their organization and its role. The organization information is intended to be available for hosting sites to better understand the population they are serving with the app.

Registered users are able to retrieve past conversions that they have done.

#### Admin Users

Registered users who have been given the admin role are able to perform some other functions:
* Retrieve a list of all equations converted
* Retrieve a list of all feedback entered
* Retrieve a list of all HTML files uploaded for conversion

### Hosting

An instance of the application is hosted by Benetech in Microsoft Azure:
* Online form: https://mathmlcloud.org
* API use: https://api.mathmlcloud.org

If you wish to run the application in your own environment, feel free to clone or fork this repository. The Vagrantfile in the project has a provider definition that allows you to provision an instance in Microsoft Azure, but you are free to host it wherever you like. Documentation on provisioning in other virtual machine environments, like Docker, Hyper-V or AWS, is available on the Vagrant site.

### License

See the [LICENSE.txt](LICENSE.txt) file for use information.
