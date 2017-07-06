exports.routes = (app) => {
    // let app = app().Router;
    // Authentication Middleware
    // app.get('*', function(req, res, next) {

    //     // console.log(req.session);

    //     /*
    //      *  Disable Authentication for the homepage
    //      *  and the user is not logged in
    //      *  
    //      */
    //     if ((req.url !== '/') && (req.url !== '/logout') && (req.url !== '/install') && (!req.session.userid)) {
    //         console.log('checkAuth ' + req.url);
    //         res.render('users/login.hbs', { error: 'Kindly log in to access page' });
    //         return;
    //     }

    //     next();

    // });

    // app.get("/", (req, res) => {
    //     res.render("users/logreg.hbs");
    // });

    // app.get("api/group/all", (req, res) => {
    //     return res.render("users/grouplist.hbs");
    //     // res.render("users/logreg.hbs");
    // });

    // //get group messages
    // app.get("/api/group/:id/message", (req, res) => {
    //     res.render("users/logreg");;
    // });


}