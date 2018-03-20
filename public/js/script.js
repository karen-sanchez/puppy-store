(function (w, d, $) {

	var PS = {
		init: function(){
			this.cacheDOM();
			this.homepage();
			this.productsPage();
			this.addToCart();
			this.cart();
			this.checkout();
			this.bindEvents();
		},
		cacheDOM: function(){
			// if a selector is used > 1 add it to cacheDOM
			this.$puppyProduct = $('.product-info');
		},
		bindEvents: function(){
			// binding events in modular js changes the 'this' context
			$('.modal-btn').on('click', this.productsModal);
			$('.empty-cart').on('click', this.emptyCart);
			$('.open-sidenav').on('click', this.openNav);
			$('.closebtn').on('click', this.closeNav);
		},
		homepage: function() {
			var picsArray = [],
				imgCreditArray = [],
				imgFnameArray = [],
				imgLnameArray = [];
				utm = '?utm_source=puppy_store&utm_medium=referral';

			// filter returned images by size, then push into picsArray
			$('.carousel-images').each(function() {  
				var imgSrc = $(this).find('img').attr('src'),
					imgHeight = $(this).find('.height').html(),
					imgCredit = $(this).find('.imgAuthor').html(),
					imgFname = $(this).find('.credit-fname').html(),
					imgLname = $(this).find('.credit-lname').html(),
					maxHeight = 2500;

				if(imgHeight <= maxHeight){
					picsArray.push(imgSrc);
					imgCreditArray.push(imgCredit);
					imgFnameArray.push(imgFname);
					imgLnameArray.push(imgLname);
				};
			 }); 

			// replace the img src in each carousel item and give credit to photographer
			for(var i = 0; i < picsArray.length ; i++) {
				var image = '<div class="carousel-item">' +
							'<img src=" '+ picsArray[i] +' ">' +
							'<div class="carousel-caption">' +
							'Photo by: <a href="'+ imgCreditArray[i] + utm +'">'+ imgFnameArray[i] + ' ' + imgLnameArray[i] +'</a>'+
							'</div>'+
							'</div>',
					indicators = '<li data-target="#puppy-carousel" data-slide-to="'+i+'"></li>';

				$(image).appendTo('.carousel-inner');
				$(indicators).appendTo('.carousel-indicators');
			};

			$('.carousel-item').first().addClass('active');
			$('.carousel-indicators > li').first().addClass('active');
			$('#puppy-carousel').carousel({
				interval: 2500
			});
		},
		openNav: function(){
			$('.sidenav').width('250px');
		},
		closeNav: function(){
			$('.sidenav').width('0px');
		},
		productsPage: function() {
			this.$puppyProduct.addClass('card');

			// appending author-credit codes to each profile link
			$('.author-credit').each(function(){
				var currentUrl = $(this).children().attr('href'),
					newUrl = currentUrl + utm;

					$(this).children().attr('href', newUrl);
			});

			// on hover display photographer name
			$('.product-links').hover(
				function() {
					$(this).addClass('overlay');
					$(this).find('.photographer-account').removeClass('d-none');
				}, function() {
					$(this).removeClass('ovelay');
					$(this).find('.photographer-account').addClass('d-none');
				}
			);
		},
		productsModal: function(){
			// get new image src from click event
			var newSrc = $(this).parent().next().find('.modal-img').attr('href');		
			$('.modal-content').children().attr('src', newSrc);
		},
		addToCart: function(){
			// all values in local storage are strings
			// Objects may be stored in local storage by first turning them into JSON strings (with JSON.stringify()) 
			// and then back into JavaScript objects (with JSON.parse()):
			var	cart;

			if (localStorage.getItem('cart')) {
				cart = JSON.parse(localStorage.getItem('cart'));
			} else {
				cart = [];
			}

			$('.add-to-cart').on('click', function(){
				var productName = $(this).closest('.product-info').find('.puppy-name').find('strong').text(),
					productImage = $(this).closest('.product-info').find('.puppy-image').attr('href'),
					productPrice = $(this).closest('.product-info').find('.puppy-price').find('strong').text();

				cart.push({
					item: productName,
					image: productImage,
					price: productPrice
				});

				// stringify cart objects to be pushed into local storage
				var jsonStr = JSON.stringify(cart);
				// set new stringified cart into local storage 
				localStorage.setItem('cart', jsonStr);

				// add blue background to cart icon once product is added to cart
				$(this).find('i').addClass('added-to-cart');
			});
		},
		cart: function(){
			// get cart from local storage 
			var cartValue = localStorage.getItem('cart'),
			// parse stringified cart back into original objects to be manipulated
				cartObj = JSON.parse(cartValue),
				clicked = false,
				priceHolder = [],
				newPriceArr = [];

			// find product name and price and output to table
			$.each(cartObj, function(key, value) {
				var	productName = value.item,
					productPrice = value.price,
					productImage = value.image,
					cartProducts = '<div class="item-column row pt-3 pb-3"><div class="col-12 col-sm-6 col-md-4 text-center"><div class="product-image"><img src="' + productImage + '" style="height: 150px;"></div></div>' +
									'<div class="col-12 col-sm-6 col-md-4 my-auto text-center pt-3"><p class="product-name">' + productName + '</p>' +
						  			'<p class="product-price">Price: $' + productPrice + '</p></div>' +
						  			'<div class="col my-auto text-center pt-3"><i class="lnr lnr-md lnr-trash remove-item" data-clicked="false"></i></div></div>';
					priceHolder.push(productPrice);
					$('#cart-table').append(cartProducts);
			});

			// if remove item link is clicked, reset local storage item to new array
			$('.remove-item').on('click', function(){
				var itemName = $(this).closest('.item-column').find('.product-name').html(),
					clicked = true,
					removeSingleItem = cartObj.filter(function(el) {
						return el.item !== itemName;
					});

				if (clicked === true){
					cart = removeSingleItem;

					$(this).closest('.item-column').remove();
					window.location.reload();
					localStorage.setItem('cart', JSON.stringify(cart));
				}
			});

			// find each item price, convert into a number, add, and output to total section
			for(key in priceHolder) {
				if(priceHolder.hasOwnProperty(key)) {
					var value = priceHolder[key];

					newPriceArr.push(PS._strToNum(value));
				};
			};
			// calculate total if array is not empty, else total is 0
			if (newPriceArr.length != ''){
				var cartTotal = newPriceArr.reduce(PS._sum);
				$('#cart-total').append(cartTotal);
				localStorage.setItem('cartTotal', JSON.stringify(cartTotal));
			} else {
				$('#cart-total').append('0');
			};
		},
		emptyCart: function() {
			$('#cart-table').remove();
			$('#cart-total').empty();
			localStorage.clear();
		},
		checkout: function(){
			var getCartTotal = localStorage.getItem('cartTotal'),
				cartTotalObj = JSON.parse(getCartTotal);

				$('#checkout-total').append(cartTotalObj);

			// form validation
			$('#checkoutForm').validate();

			$('#checkoutForm').submit(function(e){
				// location autocomplete
				$.LiveAddress({
					key: '25507696545888207',
					waitForStreet: true,
					debug: true,
					target: "US",
					addresses: [{
						country: "#country",
						address1: "#street",
						locality: "#city",
						administrative_area: "#state",
						postal_code: "#ZIP"
					}]
				});

				$('form button').css('color', '#ecf3f6');
				if ($('#checkoutForm').valid()){
					$('#checkoutModal').modal('show');
				};
				e.preventDefault();
			});

			// reset form
			$('.reset-form').click(function(){
				$('#checkoutForm').trigger('reset');
			});
		},
		// private methods
		_strToNum: function(str){
			var num;
			if( /^[-+]?[0-9]+\.[0-9]+$/.test(str) ) {
				num = parseFloat(str);
			} else if( /^\d+$/.test(str) ) {
				num = parseInt(str, 10 );
			} else {
				num = Number(str);
			}
			
			if( !isNaN( num ) ) {
				return num;
			} else {
				return false;
			}
		},
		_sum: function(total, num) {
			return total + num;
		}
	};

	PS.init();

}(window, document, jQuery));