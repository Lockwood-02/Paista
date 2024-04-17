const bcrypt = require('bcrypt');
const { Users } = require('../dataAccessLayer/sequelize');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

module.exports = function(app){
    app.use(passport.initialize());
    app.use(passport.session());

    //passport setup
    passport.serializeUser((user,done) =>{
        console.log("serializing user");
        done(null,{_id:user.id});
    });
    
    passport.deserializeUser(async (id,done) => {
        console.log("deserializing user: ", id);
        try{
            const user = await Users.findByPk(id._id);
            done(null,user);
        }catch(err){
            console.log("Error deserializing");
            done(err);
        }
    });
    
    passport.use(new LocalStrategy(
        async (username, password, done) => {
            console.log("using local strat");
            try{
                const user = await Users.findOne({
                    where:{
                        username:username
                    }
                })
                if(!user){
                    console.log("Attempted login to nonexistnat user")
                    return done(null, false);//return all data stored in the user object
                }else if(!bcrypt.compare(user.hashedPassword, password)){
                    console.log("Attempt to login with wrong password");
                    return done(null, false);//wrong password
                }else{
                    console.log("Successful login!");
                    return done(null,user);
                }
            }catch(err){
                done(err);
            }
            
        }
    ))  
    
    app.post('/api/signup', async (req, res) => {
        console.log("Signup route called")//debug
        try {
            // Extract form data from request body
            const { username, password, email, firstName, lastName } = req.body;
      
            // Log the value of hashedPassword
            console.log('Password:', password);
      
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);
      
            // Create a new user using Sequelize model methods with hashed password
            const newUser = await Users.create({
                username,
                hashedPassword: hashedPassword,
                email,
                firstName,
                lastName
            });
    
            console.log("Created user: ", username);
            res.json(newUser);
        } catch (error) {
            // Handle error (e.g., display error message)
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });
      
    
    app.post('/api/login', passport.authenticate('local'), (req, res) => {
        console.log("login route called")//debug
        req.session.user = req.user.username;
        res.sendStatus(200);
    });  
}
