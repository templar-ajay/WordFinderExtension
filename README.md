# Word Finder Extension

A Chrome Extension to save keywords and search and navigate to then on webpages and PDFs

# Scope of this Web Service

1. Find and navigate to the saved keywords in the extension on

   - web pages
   - PDFs on web (feature not added yet)

2. Users can Register, Login, Reset Password through OTP on email.

3. a simple web page to download the extension.

# To run on development

1.  Go to `client/` by `cd client/`

    - `npm i` and then `npm run dev`

2.  In new split terminal goto `server/` by `cd server`

    - `npm i`
    - create a `.env` file and enter the following contents in it.

      ```.env
      MONGO_URI="mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.3"
      APP_ID="your email address"
      APP_PASSWORD="generated email app password"
      TOKEN_SECRET="secretKey"
      ORIGIN="http://localhost:3000"
      ```

    - `npm run dev`
