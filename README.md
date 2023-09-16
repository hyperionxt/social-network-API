# Features:

* CRUD system.  
* Cloud image upload-update-delete with Cloudinary service. 
* JWT.  
* Resend service to ask recover password request.
* Schemas validator.  
* Superuser implementation(roles)  
* Filter posts and communties by categories.  
* Endpoints documentation by Swagger.  
* Client side can implement login by google, the user model is ready for that.  
* Everything is modularized for re-use in other projects.
* MongoDB Atlas.
* Redis as cache db
* Project dockerized.
* Transactions

### Developing:
* nginx, mailchimp and updating swagger doc, convertion to TS.

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

* available at http://localhost:{local-port}/api/docs


## How to install

1. Type ``npm i `` in root path to get all dependencies from package.json. you can also dockerize it using ``docker compose up``

2. Create a cluster in your [MongoDB Atlas](https://www.mongodb.com/atlas/database) project.
  
3. Create an account in [Cloudinary](https://cloudinary.com/) service.

4. Create an account in [Resend](https://resend.com/home) service

    import: you can only send testing emails to your own email address, you need to register a valid domain in this page to send to others email addresses.

4. Enviroments variables

      create a .env file in the root path and inside define 9 variables:
      
        DOCKER_PORT = docker port backend server.
        LOCAL_PORT = local port backend server.
        MONGODB_URI = your mongodb atlas connection string(remember replace your password user inside of this string)
        SECRET_KEY = secret key token for JWT middleware.  
        RESEND_API_KEY = API key from your Resend account  
        DOMAIN = your registered domain.
        CLOUD_NAME = from your cloudinary account.
        API_KEY = from your cloudinary account.
        API_SECRET = from your cloudinary account.
        REDIS_HOST = db name
        REDIS_DOCKER_PORT = redis port 6379 as default
        REDIS_LOCAL_PORT = redis local port
        REDIS_PASS = create a new one here

5. Type ``npm run dev`` in root path or if you used docker, just run the container.

note:
  endpoints were tested with [Thunder Client VSC](https://www.thunderclient.com/) extension
  tests done with jest and supertest

## Find a bug?

If you found an issue or would like to submit an improvement to this project, please submit it using the issues tab above.  If you would like to submit a PR with with a fix, reference the issue you created.






