//jshint esversion:6
import express from 'express';
import ejs from 'ejs';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
app.set('view engine', 'ejs');

const port = process.env.PORT || 3000;


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
