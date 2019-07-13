const express = require('express');
const app = express();

app.use(express.static('public'));

var campgrounds = [
  {
    name: 'Salmon Creek',
    image:
      'https://newhampshirestateparks.reserveamerica.com/webphotos/NH/pid270015/0/540x360.jpg'
  },
  {
    name: 'Granite Hill',
    image: 'http://www.gobroomecounty.com/files/hd/Campground1.jpg'
  },
  {
    name: 'Mountain Goat Rest',
    image:
      'https://static.rootsrated.com/image/upload/s--57yGFSjg--/t_rr_large_traditional/hk4f6bggvuv1imvxfz1h.jpg'
  }
];

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/campgrounds', (req, res) => {
  res.render('campgrounds', { campgrounds });
});

app.listen(3000, () => {
  console.log('app listening on port 3000!');
});
