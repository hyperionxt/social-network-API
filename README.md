# Features:

* CRUD system.  
* Cloud image upload-update-delete with Cloudinary service. 
* JWT authentication.  
* JWT recovery password.  
* Schemas validator.  
* Superuser implementation(roles)  
* Filter posts and communties by categories.  
* Endpoints documentation by Swagger.  
* Client side can implement login by google, the user model is ready for that.  
* Everything is modularized for re-use in other projects.
* MongoDB Atlas.

### Developing:
* Updating and adding new Swagger doc

## More details:

### Users:

 * users can register, login and logout  
 * users can be superuser or not
 * users can upload an image as pfp.
 * users can update their profile(description, password, email, image)  
 * users can ask a recover password request.

### JWT:

* there are endoints protected by tokens authentication middlewares,  
* forgot password request token creation, 


### Posts:

* you can get all posts as a home page.  
* posts are classified by categories.  
* users can create, delete and update their posts.
* user can upload, delete or update image files in their posts.  

### Communties:

* users can create, delete and update their communties.
* users can upload a community image.  
* communities are classified by categories.  

### Categories:

* only superusers are allowed to create, delete, and update categories.  

### Suscriptions:

* users can subscribe to communties.  
* users can get all their suscriptions  

### Comments:

* users can create, delete and update their comments.
* user can upload images.  
* users can reply comments.  

### Superusers:

* superusers have all permissions.  

### Swagger endpoints documentation:

* available at http://localhost:{your-backend-port}/api/docs  


## How to install

1. Type ``$ npm i `` in root path to get all dependencies from packge.json.

2. Create a cluster in your [MongoDB Atlas](https://www.mongodb.com/atlas/database) project.
  
3. Create an account in [Cloudinary](https://cloudinary.com/) service.

4. Enviroments variables

      create a .env file in the root path and inside define 8 variables:
      
        PORT = your port backend server.
        MONGODB_URI = your mongodb atlas connection string(remember tu put your password user inside of this string)
        SECRET_KEY = secret key token for JWT middleware.  
        USER = the email manager for nodemailer(this email is gonna send a link to users to recover their passwords)  
        PASSWORD = app password by google(must to be from the same previous email)
        CLOUD_NAME = from cloudinary
        API_KEY = from cloudinary
        API_SECRET = from cloudinary  

5. Type ``$ npm run dev`` in root path to run the backend.


note: endpoints were tested with [Thunder Client VSC](https://www.thunderclient.com/) extension

## Find a bug?

If you found an issue or would like to submit an improvement to this project, please submit it using the issues tab above.  If you would like to submit a PR with with a fix, reference the issue you created.






