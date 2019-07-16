const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Schema Setup
const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String
});

const Campground = mongoose.model('Campground', campgroundSchema);

// Campground.create(
//   {
//     name: 'Granite Hill',
//     image: 'http://www.gobroomecounty.com/files/hd/Campground1.jpg'
//   },
//   (err, campground) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log('newly created campground');

//       console.log(campground);
//     }
//   }
// );

app.use(express.static('public'));

// var campgrounds = [
//   {
//     name: 'Mountain Goat Rest',
//     image:
//       'https://static.rootsrated.com/image/upload/s--57yGFSjg--/t_rr_large_traditional/hk4f6bggvuv1imvxfz1h.jpg'
//   }
// ];

app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/campgrounds', (req, res) => {
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds', { campgrounds });
    }
  });
});

app.post('/campgrounds', (req, res) => {
  const { name, image } = req.body;
  Campground.create(
    {
      name,
      image
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

app.get('/campgrounds/new', (req, res) => {
  res.render('new.ejs');
});

app.listen(3000, () => {
  console.log('app listening on port 3000!');
});
