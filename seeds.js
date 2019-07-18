const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment');

const data = [
  {
    name: "Cloud's Rest",
    image:
      'https://images.unsplash.com/photo-1497900304864-273dfb3aae33?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
    description: 'blah blah blah'
  },
  {
    name: 'Desert Mesa',
    image:
      'https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
    description: 'blah blah blah'
  },
  {
    name: "Dog's Heaven",
    image:
      'https://images.unsplash.com/photo-1515408320194-59643816c5b2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
    description: 'blah blah blah'
  }
];

function seedDB() {
  // remove all campgrounds
  Campground.remove({}, err => {
    if (err) {
      console.log(err);
    } else {
      console.log('removed campgrounds!');
      // add a few campgrounds
      data.forEach(seed => {
        Campground.create(seed, (err, campground) => {
          if (err) {
            console.log(err);
          } else {
            console.log('added a campground');

            // create a comment
            Comment.create(
              {
                text: 'This place is great, but I need internet.',
                author: 'Homer'
              },
              (err, comment) => {
                if (err) {
                  console.log(err);
                } else {
                  campground.comments.push(comment);
                  campground.save();
                  console.log('created new comment');
                }
              }
            );
          }
        });
      });
    }
  });

  // add a few comments
}

module.exports = seedDB;
