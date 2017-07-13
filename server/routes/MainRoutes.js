
export default function MainRoutes (app) {

  // check users authentication
	app.get("*", (req, res, next)=>{
		if ((req.url !== '/')  && (!req.session.username)) {
	
			console.log('checkAuth ' + req.url);
			
			return res.status(400).json({ 
				success: false,
				message: "Please login" 
			});
		}else{
			next();
		}
	});
	
	//login page route
	app.get("/", (req, res) => {
		return res.status(200).json({
			success: true,
			message : 'Welcome to Postit, Please login'
		});
	});
	
	// other pages routes
	app.get("/user/*", (req, res) => {
		return res.status(200).json({
			success: true,
			message : 'Users pages'
		});
	});
	
	// logs out the user
	app.get("/logout", (req, res)=>{
		req.session.destroy((err) => {});
		
		return res.json({
			success: true,
			message : 'You are logged out succesfully'
		});
	});
};