//jshint esversion:6
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');

// const models
const userModel = require('./models/userModel');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
app.set('view engine', 'ejs');

const port = process.env.PORT || 3000;
const dbName = process.env.DB_Name || 'secretsDB';
const dbString = process.env.DB_STRING || `mongodb://localhost:27017/${dbName}`;

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
    get((req, res) => {
        res.render('login');
    }).
    post((req, res) => {
        const username = req.body.username;
        const password = req.body.password;

        userModel.findOne({ email: username }, (err, docs) => {
            if (err) {
                console.log('Error verifying user: ', err);
            }
            else {
                if (docs) {
                    if (docs.password === password) {
                        res.render("secrets");
                    }
                }
            }
        });
        
    })

app.route('/register').
    get((req, res) => {
        res.render('register');
    }).
    post((req, res) => {
        const userEmail = req.body.username || null;
        const userPassword = req.body.password || null;

        if (userEmail && userPassword) {
            const newUser = new userModel({
                email: userEmail,
                password: userPassword
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

// Fire up the server -----------
app.listen(port, () => {
    console.log('Server is running on port ' + port);

})
