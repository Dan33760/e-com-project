const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorsController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('67c617714803dee3971718a6')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorsController.getNotFound);

mongoose
    .connect('mongodb+srv://dansk:9ZW2QpyLCpetXzde@cluster0.pyg1o.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0')
    .then(result => {
        User.findOne()
            .then(user => {
                if(!user) {
                    const user = new User({
                        name: 'Dan\'SK',
                        email: 'dansivyolo@gmail.com',
                        cart: {
                            items: []
                        }
                    });
                    user.save();
                }
            });

        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });

