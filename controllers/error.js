exports.getNotFound = (req, res, next) => {
    res.render('404', {
        pageTitle: 'page Not Found',
        path: '/404'
    });
}