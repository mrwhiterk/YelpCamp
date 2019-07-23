const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');

// INDEX
router.get('/', (req, res) => {
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', { campgrounds });
    }
  });
});

// CREATE
router.post('/', middleware.isLoggedIn, (req, res) => {
  const { name, image, description, price } = req.body;
  const author = {
    id: req.user._id,
    username: req.user.username
  };

  const campground = { author, name, image, description, price };
  Campground.create(campground, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      // console.log(newlyCreated);
      res.redirect('/campgrounds');
    }
  });
});

router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

router.get('/:id', (req, res) => {
  Campground.findById(req.params.id)
    .populate('comments')
    .exec((err, foundCampground) => {
      if (err) {
        console.log(err);
      } else {
        res.render('campgrounds/show', { campground: foundCampground });
      }
    });
});

// edit
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    res.render('campgrounds/edit', { campground });
  });
});

// update
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndUpdate(
    req.params.id,
    req.body.campground,
    (err, updatedCampground) => {
      if (err) {
        res.redirect('/campgrounds');
      } else {
        res.redirect(`/campgrounds/${req.params.id}`);
      }
    }
  );
});

router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, (err, campgroundRemoved) => {
    if (err) {
      console.log(err);
    }
    Comment.deleteMany({ _id: { $in: campgroundRemoved.comments } }, err => {
      if (err) {
        console.log(err);
      }
      res.redirect('/campgrounds');
    });
  });
});

module.exports = router;
