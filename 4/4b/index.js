const express = require('express');
const hbs = require('hbs');
const path = require('path');
const app = express();
const port = 5001;

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/add-heroes', (req, res) => {
    res.render('add-heroes');
});

app.get('/add-type', (req, res) => {
    res.render('add-type');
});

app.get('/detail/:id', (req, res) => {
    res.render('detail');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
