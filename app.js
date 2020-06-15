//jshint esversion:6
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// const models
const userModel = require('./models/userModel');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
app.set('view engine', 'ejs');

// Load environment variables
const port = process.env.PORT || 3001;
const dbName = process.env.DB_NAME || 'secretsDB';
const dbString = process.env.DB_STRING || `mongodb://localhost:27017/${dbName}`;
const saltRounds = process.env.SALT_ROUNDS ;

// Connect DB -----------
mongoose.connect(dbString, { useNewUrlParser: true, useUnifiedTopology: true }, err => {
    if (err)
        console.log(`Error connecting to DB: `, err);
    else
        console.log(`Connected to MongoDB`);

});

// Routes -----------
app.get('/', (req, res) => {
    res.render('home');
});

app.route('/login').
    get(async (req, res) => {
        res.render('login');
    }).
    post(async (req, res) => {
        const username = req.body.username;
        const password = req.body.password;

        userModel.findOne({ email: username }, (err, docs) => {
            if (err) {
                console.log('Error verifying user: ', err);
            }
            else {
                if (docs) {
                    bcrypt.compare(password,docs.password).then(isMatch => {
                        if (isMatch) {
                            res.render("secrets");
                        }
                    });
                    
                }
            }
        });

    });

app.route('/register').
    get(async (req, res) => {
        res.render('register');
    }).
    post(async (req, res) => {
        const userEmail = req.body.username || null;
        const userPassword = req.body.password || null;

        if (userEmail && userPassword) {
            bcrypt.hash(userPassword, parseInt(saltRounds), (err, hash) => {
                if (err) {
                    console.log(`Error hashing password: `, err);

                }
                else {
                    const newUser = new userModel({
                        email: userEmail,
                        password: hash
                    });

                    newUser.save((err) => {
                        if (err) {
                            console.log(`Registration failed for user ${userEmail}`, err);
                        }
                        else {
                            res.render('secrets');
                        }
                    });
                }
            })
        }


    });

// Fire up the server -----------
app.listen(port, () => {
    console.log('Server is running on port ' + port);

});
