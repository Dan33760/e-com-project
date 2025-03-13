const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csurf = require('csurf');
const flash = require('connect-flash');

const errorsController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = 'mongodb+srv://dansk:9ZW2QpyLCpetXzde@cluster0.pyg1o.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0';

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});
const csurfProtection = csurf();

// Configurer le moteur de template
app.set('view engine', 'ejs');
app.set('views', 'views');

// Importer les routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

// Initialiser le session
app.use(
    session({
        secret: 'my session',
        resave: false,
        saveUninitialized: false,
        store: store
    })  
);
app.use(csurfProtection);
app.use(flash())

// Ajouter l'utilisateur sur chaque requete s'il est Authentifier
app.use((req, res, next) => {
    if(!req.session.user) {
        return next();
    }

    User.findById(req.session.user._id)
        .then(user => {
            if(!user) {
                return next();
            }
            req.user = user;
            res.locals.userName = user.name
            next();
        })
        .catch(err => {
            next(new Error(err));
        });
});

// Disponibiliser les variable sur chaque page
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

// Ajoter les routes de l'application
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use('/500', errorsController.get500);

// PAGE NOT FOUND
app.use(errorsController.getNotFound);

// Add Error Handling middleware with express
app.use((error, req, res, next) => {
    res.redirect('/500');
})

// Connecter a la base de donnees
mongoose
    .connect(MONGODB_URI)
    .then(result => {
        console.log('CONNECTED')

        app.listen(3000);
    })
    .catch(err => {
        console.log('Erreur de connexion a la base de donnee')
        // console.log(err);
    });

