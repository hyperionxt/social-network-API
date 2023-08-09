Description:

This social network API was made in nodejs with express and mongodb and has the following functions:


CRUD system.
Upload files(.jgp, .png).
JWT authentication.
JWT recovery password.
Schemas validators.
Filter posts and communties by categories.
Endpoints documentation by Swagger.
Client side can implement login by google, the user model is ready for that.
Endpoints are modularized for reuse in other projects.


More details:

Authentication:

users can register, login and logout
users can be superuser or not
users can update their profile(description, password, email)
users can ask a request to recover their password if they forgot it.
users can upload an image as pfp.


Posts:

you can get all posts as a home page.
posts are classified by categories.
users can create, delete and update their posts.

Communties:

users can create, delete and update their communties.
communities are classified by categories.

Categories:

only superusers are allowed to create, delete, and update categories.

Suscriptions:

users can subscribe to communties.
users can get all their suscriptions

Comments:

users can create, delete and update their comments.
users can reply comments.

Superusers:

superusers have all permissions.

Swagger Documentation:

Version 1 are available at http://localhost:<your-port>/api/docs


installation

1. install mongodb from the official page(in case you went local)

2. run this from the root path to get all dependencies from packge.json:
  npm i

3. enviroments variables

  create a .env file in the root path and inside define 4 variables:
  
  PORT = your port backend server(in case you are in local mode)  
  SECRET_KEY = secret key token creation for JWT, authentication and recovery password token middlewares.  
  USER = the email manager for nodemailer(this email is gonna send a link to users to recover their passwords)  
  PASSWORD = app password by google(must to be from the same previous email)  

4. type npm run dev to run the backend.


endpoints were tested with Thunder Client VSC extension




