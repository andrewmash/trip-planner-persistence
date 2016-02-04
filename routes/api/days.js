var express = require('express');
var router = express.Router();
var models = require('../../models');
// var Hotel = models.Hotel;
// var Restaurant = models.Restaurant;
// var Activity = models.Activity;
var Day = models.Day;
var Promise = require('bluebird');

// router.get('/hotels', function (req, res) {
// 	Hotel.find()
// 	.then(function(hotels) {
// 		res.json(hotels);
// 	}).then(null, function(error) {
// 		console.log("Couldn't find the hotels:(");
// 	});
// });

// router.get('/restaurants', function (req, res) {
// 	Restaurant.find()
// 	.then(function(restaurants) {
// 		res.json(restaurants);
// 	}).then(null, function(error) {
// 		console.log("Couldn't find the restaurants:(");
// 	});
// });

// router.get('/activities', function (req, res) {
// 	Activity.find()
// 	.then(function(activities) {
// 		res.json(activities);
// 	}).then(null, function(error) {
// 		console.log("Couldn't find the activities:(");
// 	});
// });

router.param('id', function(req, res, next, id) {
	Day.findById(id)
	.populate('hotel restaurants activities')
	.then(function(day) {
		req.day = day;
		next();
	}).then(null, next);
});

router.get('/days', function (req, res) {
	Day.find()
	.populate('hotel restaurants activities')
	.then(function(days) {
		res.json(days);
	}).then(null, next);
});

router.get('/days/:id', function (req, res) {
	res.json(req.day);
});

router.post('/days', function (req, res) {
	Day.create({number: req.body.number,
		hotel: req.body.hotel,
		restaurants: req.body.restaurants,
		activities: req.body.activities
		})
	.then(function (day) {
		res.json(day);
	});
});

router.put('/days/:id', function (req, res) {
	Day.update({ id: req.body.id,
		number: req.body.number,
		hotel: req.body.hotel,
		restaurants: req.body.restaurants,
		activities: req.body.activities
		});
});

router.delete('/days/:id', function (req, res) {
	Day.remove({ id: req.params.id })
	.then(function() {
		console.log("Day removed");
	}).then(null, next);
});

router.get('/days/:id/hotel', function(req, res) {
	res.json(req.day.hotel);
});

router.post('/days/:id/hotel', function(req, res) {
	req.day.hotel = req.body;
	req.day.save(function () {
		console.log("Saved successfully");
	});
});

router.delete('/days/:id/hotel', function(req, res) {
	req.day.hotel = null;
	req.day.save(function () {
		console.log("Deleted successfully");
	});
});

router.get('/days/:id/restaurant', function(req, res) {
	res.json(req.day.restaurant);
});

router.post('/days/:id/restaurant', function(req, res) {
	req.day.restaurant = req.body;
	req.day.save(function () {
		console.log("Saved successfully");
	});
});

router.delete('/days/:id/restaurant', function(req, res) {
	req.day.restaurant = null;
	req.day.save(function () {
		console.log("Deleted successfully");
	});
});

router.get('/days/:id/activity', function(req, res) {
	res.json(req.day.activity);
});

router.post('/days/:id/activity', function(req, res) {
	req.day.activity = req.body;
	req.day.save(function () {
		console.log("Saved successfully");
	});
});

router.delete('/days/:id/activity', function(req, res) {
	req.day.activity = null;
	req.day.save(function () {
		console.log("Deleted successfully");
	});
});




module.exports = router;