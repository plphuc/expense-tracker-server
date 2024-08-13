// npm install @apollo/server express graphql cors
import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import connectMongo from 'connect-mongodb-session';
import passport from 'passport';
import { configurePassport } from './passport/passport.config.js';

import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';

import { connectDB } from './db/connectDB.js';
import mergedTypeDefs from './typeDefs/index.js';
import mergedResolvers from './resolvers/index.js';

dotenv.config();
configurePassport();

// Required logic for integrating with Express
const app = express();
// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer,
// enabling our servers to shut down gracefully.

const MongoDBStore = connectMongo(session);
const store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'sessions'
});

store.on('error', (err) => console.log(err));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false, // this option specifies whether to save the session to the store on every request
        saveUninitialized: false, //this option specifies whether to save uninitialized sessions
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true // this option prevents the Cross-site scripting (XSS) attacks
        },
        store: store
    })
);

app.use(passport.initialize());
app.use(passport.session());

// Same ApolloServer initialization as before, plus the drain plugin
// for our httpServer.
const httpServer = http.createServer(app);

const server = new ApolloServer({
    typeDefs: mergedTypeDefs,
    resolvers: mergedResolvers,
    persistedQueries: false,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
});

await server.start();

// Set up our Express middleware to handle CORS, body parsing,
// and our expressMiddleware function.
app.use(
    '/',
    cors({
        credentials: true // to use cookie
    }),
    express.json()
);

await connectDB();

server.applyMiddleware({app})

export default httpServer;
