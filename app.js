//jshint esversion:6
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');



const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
app.set('view engine', 'ejs');

// Load environment variables
const port = process.env.PORT || 3001;
const dbName = process.env.DB_NAME || 'secretsDB';
const dbString = process.env.DB_STRING || `mongodb://localhost:27017/${dbName}`;

// Configure session & Authentication
app.use(session({
    secret: 'thisIsSecret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Connect DB -----------
mongoose.connect(dbString, { useNewUrlParser: true, useUnifiedTopology: true }, err => {
    if (err)
        console.log(`Error connecting to DB: `, err);
    else
        console.log(`Connected to MongoDB`);
});
mongoose.set('useCreateIndex', true);

// const models
const userModel = require('./models/userModel');
passport.use(userModel.createStrategy());
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());


// Routes -----------
app.get('/', (req, res) => {
    res.render('home');
});

app.route('/login').
    get(async (req, res) => {
        res.render('login');
    }).
    post(async (req, res) => {
        const newUser = new userModel({
            username: req.body.username,
            password: req.body.password
        });
        req.login(newUser, err => {
            if (err) {
                console.log(err);

            } else {
                passport.authenticate('local',{successRedirect:'/secrets'})(req,res);
            }
        });
    });

app.get('/secrets', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('secrets');
    }
    else {
        res.redirect('login');
    }
})

app.route('/register').
    get(async (req, res) => {
        res.render('register');
    }).
    post(async (req, res) => {
        userModel.register({ username: req.body.username }, req.body.password, (err, user) => {
            if (err) {
                console.log(err);
                res.redirect('/register');
            } else {
                passport.authenticate('local')(req, res, () => {
                    res.redirect('/secrets');
                });
            }
        });
    });

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})

// Fire up the server -----------
app.listen(port, () => {
    console.log('Server is running on port ' + port);
    console.log(`Access URL: http://localhost:${port}`)

});
