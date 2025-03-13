exports.getNotFound = (req, res, next) => {
    res.status(404).render('404', {
        pageTitle: 'page Not Found',
        path: '/404',
        isAuthenticated: res.isLoggedIn
    });
}

exports.get500 = (req, res, next) => {
    res.status(500).render('500', {
        pageTitle: 'Error!',
        path: '/500',
        isAuthenticated: res.isLoggedIn
    });
}