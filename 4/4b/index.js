const express = require('express');
const hbs = require('hbs');
const { Pool } = require('pg');
const path = require('path');
const session = require('express-session');
const multer = require('multer');
const app = express();
const port = 5001;

// membuat koneksi ke database
const pool = new Pool({
    user: 'postgres',
    password: 'admin',
    host: 'localhost',
    database: 'finaltask',
    port: 5432
});

// setting file upload multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
            null,
            file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
        );
    },
});
const upload = multer({ storage });

// Tes koneksi database
(async () => {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('Database connected at:', res.rows[0].now);
    } catch (err) {
        console.error('Error connecting to the database:', err.stack);
    }
})();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(session({
    secret: 'kUc1n9M4mA',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

hbs.registerPartials(path.join(__dirname, 'views', 'partials'));
hbs.registerHelper("isOwner", function (sessionUserId, HeroesUserId, options) {
    if (sessionUserId === HeroesUserId) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});


app.get('/', async (req, res) => {
    try {
        const queryText = `
            SELECT heroes_tb.id, heroes_tb.name AS hero_name, heroes_tb.photo,
                type_tb.name AS type_name,
                users_tb.username AS user_name
            FROM heroes_tb
            JOIN type_tb ON heroes_tb.type_id = type_tb.id
            JOIN users_tb ON heroes_tb.user_id = users_tb.id
            ORDER BY heroes_tb.id DESC
        `;
        const { rows: heroes } = await pool.query(queryText)
        const user = req.session.user;

        console.log("ini data hero: ", heroes);
        console.log("ini data user: ", user);
        res.render('index', { heroes, user });
    } catch (error) {
        console.log("Error memuat home: ", error);
        res.status(500).send("Something went wrong");
    }
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const result = await pool.query(
            `SELECT * FROM users_tb WHERE username = $1 AND password = $2`,
            [username, password]
        );

        if (result.rows.length > 0) {
            const user = result.rows[0];

            req.session.user = {
                id: user.id,
                username: user.username,
                email: user.email
            }
            console.log("data user login: ", req.session.user);
            res.redirect('/');
        } else {
            console.log('error', 'username atau password salah');
            res.redirect('/login');
        }
    } catch (error) {
        console.log("Error login: ", error);
        res.status(500).send("Something went wrong");
    }
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const queryText = `INSERT INTO users_tb(username, email, password) VALUES($1, $2, $3) RETURNING *`;
        const values = [username, email, password];

        const result = await pool.query(queryText, values);

        // cek data berhasil di input 
        console.log("Data berhasil diinput: ", result.rows[0]);

        res.redirect('/login');
    } catch (error) {
        console.log("Error input data: ", error);
        res.status(500).send("Something went wrong");
    }
});

app.get('/add-heroes', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM type_tb')
        const types = result.rows;

        res.render('add-heroes', { types })
    } catch (error) {
        console.log("Error memuat data add heroes", error);
        res.status(500).send("Something went wrong");
    }

});

app.post('/add-heroes', upload.single('input-image'), async (req, res) => {
    try {
        const { 'input-name': name, 'select-type': type_id } = req.body;
        const photo = req.file ? req.file.path : null;
        const user_id = req.session.user.id;

        const queryText = `
            INSERT INTO heroes_tb (name, type_id, photo, user_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        ;`
        const values = [name, type_id, photo, user_id];

        const result = await pool.query(queryText, values);
        const hero = result.rows[0];

        console.log("Berhasil Menambahkan Hero!", hero)
        res.redirect('/');
    } catch (error) {
        console.log("Error add heroes", error);
        res.status(500).send("Something went wrong");
    }

});

app.get('/add-type', (req, res) => {
    res.render('add-type');
});

app.get('/detail/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.session.user;

        const queryText = `
        SELECT heroes_tb.id, heroes_tb.name AS hero_name, heroes_tb.photo,
            type_tb.name AS type_name,
            users_tb.id AS user_id, users_tb.username AS user_name
        FROM heroes_tb
        JOIN type_tb ON heroes_tb.type_id = type_tb.id
        JOIN users_tb ON heroes_tb.user_id = users_tb.id
        WHERE heroes_tb.id = $1
        `;

        const { rows: hero } = await pool.query(queryText, [id])

        if (hero.length === 0) {
            console.log("error", "Hero tidak ditemukan");
            return res.redirect("/");
        }

        console.log("ini data hero: ", hero);
        console.log("ini data user: ", user);
        res.render('detail', { hero: hero[0], user });
    } catch (error) {
        console.log("Gagal memual detail: ", error);
        res.status(500).send("Something went wrong");
    }
});

app.get('/edit-heroes', async (req, res) => {
    try {
        res.render('edit-heroes')
    } catch (error) {
        console.log("Gagal memuat edit heroes: ", error);
        res.status(500).send("Something went wrong");
    }
})

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
