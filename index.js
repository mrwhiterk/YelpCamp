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
      res.render('index', { campgrounds });
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
  res.render('new.ejs');
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

        res.render('show', { campground: foundCampground });
      }
    });
});

app.listen(3000, () => {
  console.log('app listening on port 3000!');
});
