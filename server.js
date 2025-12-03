require('dotenv').config();
const express=require('express');
const path=require('path');
const mongoose=require('mongoose');
const session=require('express-session');
const MongoStore=require('connect-mongo');
const expressLayouts=require('express-ejs-layouts');
const indexRouter=require('./routes/index');
const authRouter=require('./routes/auth');
const moviesRouter=require('./routes/movies');
const app=express();
const dbUri=process.env.MONGODB_URI||'mongodb://127.0.0.1:27017/movies_project';
mongoose.connect(dbUri).then(function(){console.log('Connected to MongoDB')}).catch(function(err){console.log('MongoDB connection error',err)});
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.set('layout','layout');
app.use(expressLayouts);
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));
app.use(session({
 secret:process.env.SESSION_SECRET||'change_this_secret',
 resave:false,
 saveUninitialized:false,
 store:MongoStore.create({mongoUrl:dbUri}),
 cookie:{maxAge:1000*60*60*2}
}));
app.use(function(req,res,next){
 res.locals.currentUser=req.session.user;
 res.locals.success=req.session.success;
 res.locals.errors=req.session.errors;
 delete req.session.success;
 delete req.session.errors;
 next();
});
app.use('/',indexRouter);
app.use('/',authRouter);
app.use('/movies',moviesRouter);
app.use(function(req,res){res.status(404).render('404',{title:'Page Not Found'})});
const port=process.env.PORT||3000;
app.listen(port,function(){console.log('Server listening on port '+port)});
