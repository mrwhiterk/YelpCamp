const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  Campground = require('./models/campground'),
  Comment = require('./models/comment'),
  User = require('./models/user'),
  seedDB = require('./seeds');

mongoose.connect('mongodb://localhost:27017/yelp_camp', {
  useNewUrlParser: true
});

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
seedDB();

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('landing');
});

// INDEX
app.get('/campgrounds', (req, res) => {
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', { campgrounds });
    }
  });
});

// CREATE
app.post('/campgrounds', (req, res) => {
  const { name, image, description } = req.body;
  Campground.create(
    {
      name,
      image,
      description
    },
    (err, newlyCreated) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect('/campgrounds');
      }
    }
  );
});

// NEW
app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

// SHOW
app.get('/campgrounds/:id', (req, res) => {
  Campground.findById(req.params.id)
    .populate('comments')
    .exec((err, foundCampground) => {
      if (err) {
        console.log(err);
      } else {
        console.log(foundCampground);

        res.render('campgrounds/show', { campground: foundCampground });
      }
    });
});

// ===================================
// COMMENTS ROUTES
// ===================================

app.get('/campgrounds/:id/comments/new', (req, res) => {
  // find campground by id
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { campground });
    }
  });
});

app.post('/campgrounds/:id/comments', (req, res) => {
  // lookup campground using ID
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      // create new comment
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          // connect new comment to campground
          campground.comments.push(comment);
          campground.save();
          // redirect camground show page
          res.redirect('/campgrounds/' + campground._id);
        }
      });
    }
  });
});

app.listen(3000, () => {
  console.log('app listening on port 3000!');
});
