# Description:

* CRUD system.  
* Upload files(.jgp, .png).  
* JWT authentication.  
* JWT recovery password.  
* Schemas validator.  
* Superuser implementation(roles)  
* Filter posts and communties by categories.  
* Endpoints documentation by Swagger.  
* Client side can implement login by google, the user model is ready for that.  
* Everything is modularized for re-use in other projects.  


## More details:

### Users:

 * users can register, login and logout  
 * users can be superuser or not  
 * users can update their profile(description, password, email)  
 * users can upload an image as pfp.
 * users can ask a recover password request.

### JWT:

* there are endoints protected by tokens authentication.  
* to recover a forgot password, a token will be generated in the url and send the url to the email user. this token will be validated.  


### Posts:

* you can get all posts as a home page.  
* posts are classified by categories.  
* users can create, delete and update their posts.  

### Communties:

* users can create, delete and update their communties.  
* communities are classified by categories.  

### Categories:

* only superusers are allowed to create, delete, and update categories.  

### Suscriptions:

* users can subscribe to communties.  
* users can get all their suscriptions  

### Comments:

* users can create, delete and update their comments.  
* users can reply comments.  

### Superusers:

* superusers have all permissions.  

### Swagger endpoints Ddocumentation:

* available at http://localhost:{your-backend-port}/api/docs  


## How to install

1. install mongodb from the official page(in case you went local)

 1.5. otherwise go to src/db.js and modify the mongodb connection to work  with mognodb Atlas 

3. type `` npm i `` from the root path to get all dependencies from packge.json:  
 

4. enviroments variables

      create a .env file in the root path and inside define 4 variables:
      
        PORT = your port backend server(in case you are in local mode)  
        SECRET_KEY = secret key token creation for JWT, authentication and recovery password token middlewares.  
        USER = the email manager for nodemailer(this email is gonna send a link to users to recover their passwords)  
        PASSWORD = app password by google(must to be from the same previous email)  

5. type ``npm run dev`` to run the backend.


note: endpoints were tested with [Thunder Client VSC](https://www.thunderclient.com/) extension

## Find a bug?

If you found an issue or would like to submit an improvement to this project, please submit it using the issues tab above.  If you would like to submit a PR with with a fix, reference the issue you created.






