function routes(app) {
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

    app.get("/", (req, res) => {
        res.send("Hello home page");
    });

    //get group messages
    app.get("/api/group/:id/message", (req, res) => {
        res.send(`getting message to group id ${req.params.id}`);
    });

    app.post("/api/user/signin", (req, res) => {
        res.send("Hello sign in auth");
    });

    app.post("/api/user/signup", (req, res) => {
        res.send("Hello sign up auth");
    });

    //create broadcast group
    app.post("/api/group", (req, res) => {
        res.send("Hello create group");
    });

    //add other users to group
    app.post("/api/group/:id/user", (req, res) => {
        res.send(`adding users to group id ${req.params.id}`);
    });

    //post message to group
    app.post("/api/group/:id/message", (req, res) => {
        res.send(`sending message to group id ${req.params.id}`);
    });

}

module.exports = routes;