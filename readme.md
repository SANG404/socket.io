
configure .env file inside server
# MongoDB connection URI
MONGO_URI=#your mongo db url#

# JWT secret key
JWT_SECRET=#your secret code#

# Server port
PORT=8086

for starting back end server:
cd server
npm start

for starting front end app:

cd real-time-chat
npm run dev
