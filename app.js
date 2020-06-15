//jshint esversion:6
import express from 'express';
import ejs from 'ejs';
import mongoose from 'mongoose';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
app.set('view engine', 'ejs');

const port = process.env.PORT || 3000;
const dbName = process.env.DB_Name || 'secretsDB';
const dbString = process.env.DB_STRING || `mongodb://localhost:27017/${dbName}`;

// Connect DB
mongoose.connect(dbString, { useNewUrlParser: true, useUnifiedTopology: true }, err => {
    if (err)
        console.log(`Error connecting to DB: `, err);
    else
        console.log(`Connected to MongoDB`);

});


app.get('/', (req, res) => {
    res.render('home');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.listen(port, () => {
    console.log('Server is running on port ' + port);

})
