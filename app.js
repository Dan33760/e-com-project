const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorsController = require('./controllers/error');
// const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//     User.findById('67b8730c0c9adb975573389b')
//         .then(user => {
//             req.user = new User(user.name, user.email, user.cart, user._id);
//             next();
//         })
//         .catch(err => console.log(err));
// });

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorsController.getNotFound);

mongoose
    .connect('mongodb+srv://dansk:9ZW2QpyLCpetXzde@cluster0.pyg1o.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0')
    .then(result => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });

