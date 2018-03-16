var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var unsplash = require('unsplash-api');
var dotenv = require('dotenv').load();

var clientId = process.env.clientId;
unsplash.init(clientId);

app.get('/', function(req, res){
	unsplash.searchPhotos('puppies', null, 5, 30, function(error, photos, link) {		
		res.render('pages/index', {
			photos: photos
		});
	});
})

app.get('/puppies', function(req, res){

	var pageCount = 10,
		currentPage = 1;

	//set current page if specifed as get variable (eg: /?page=2)
	if (typeof req.query.page !== 'undefined') {
		currentPage = +req.query.page;
	};

	unsplash.searchPhotos('puppies', null, currentPage, 15, function(error, photos, link) {
		res.render('pages/puppies', {
			photos: photos,
			link: link,
			pageCount: pageCount,
			currentPage: currentPage
		});
	});
});

app.get('/cart', function(req, res){
	res.render('pages/cart');
});

app.get('/checkout', function(req, res){
	res.render('pages/checkout');
});

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Set static path
app.use(express.static(__dirname + '/public'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

app.listen(3000, function(){
	console.log('Server running on 3000')
});
