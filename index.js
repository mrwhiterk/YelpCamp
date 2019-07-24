const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  flash = require('connect-flash'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  methodOverride = require('method-override'),
  Campground = require('./models/campground'),
  Comment = require('./models/comment'),
  User = require('./models/user'),
  PORT = process.env.PORT || 3000,
  seedDB = require('./seeds');

const commentRoutes = require('./routes/comments'),
  campgroundRoutes = require('./routes/campgrounds'),
  indexRoutes = require('./routes/index');

mongoose
  .connect(process.env.DATABASEURL || 'mongodb://localhost:27017/yelp_camp', {
    useNewUrlParser: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('connected to DB!');
  })
  .catch(err => {
    console.log('error: ', err.message);
  });

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
// seedDB();

// PASSPORT CONFIGURATION
app.use(
  require('express-session')({
    secret: 'Ryan is the best',
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// passes currentUser variable to all routes as middleware
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen(PORT, () => {
  console.log(`✅ port ${PORT}!\v`);
});
