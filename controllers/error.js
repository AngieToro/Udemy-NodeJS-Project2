exports.get404Error =  (req, res, next) => {

    res.status(404).render('errorPage', 
    {
        docTitle: 'Page Not Found',
        path: '/404'
    });
};