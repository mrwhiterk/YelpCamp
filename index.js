const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/yelp_camp', {
  useNewUrlParser: true
});

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Schema Setup
const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

const Campground = mongoose.model('Campground', campgroundSchema);

// Campground.create(
//   {
//     name: 'Granite Hill',
//     image:
//       'https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
//     description: 'This is a huge granite hill, no bathrooms. No water.'
//   },
//   (err, campground) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log('newly created campground: ');
//       console.log(campground);
//     }
//   }
// );

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
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('show', { campground: foundCampground });
    }
  });
});

app.listen(3000, () => {
  console.log('app listening on port 3000!');
});
