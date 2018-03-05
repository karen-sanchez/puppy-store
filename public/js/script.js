(function (w, d, $) {

	var PS = {
		init: function(){
			this.cacheDOM();
			this.homepage();
			this.productsPage();
			this.addToCart();
			this.cart();
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
					maxHeight = 4000;

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
							'<div class="carousel-caption d-none d-md-block">' +
							'<p>Photo by: </p><a href="'+ imgCreditArray[i] + utm +'">'+ imgFnameArray[i] + ' ' + imgLnameArray[i] +'</a>'+
							'</div>'+
							'</div>',
					indicators = '<li data-target="#puppy-carousel" data-slide-to="'+i+'"></li>';

				$(image).appendTo('.carousel-inner');
				$(indicators).appendTo('.carousel-indicators');
			};

			$('.carousel-item').first().addClass('active');
			$('.carousel-indicators > li').first().addClass('active');
			$('#puppy-carousel').carousel();
		},
		productsPage: function() {
			// wrap a 'row' class to every 3rd puppyProduct batch
			for(var i = 0; i < this.$puppyProduct.length; i+=3) {
				this.$puppyProduct.slice(i, i+3).wrapAll('<div class="row"></div>');
			};

			this.$puppyProduct.parent().parent().find('.row').after('<hr>')
			this.$puppyProduct.addClass('col-sm');

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
				console.log('cart exists');
			} else {
				cart = [];
				console.log('cart does not exist');
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

				$(this).text($(this).text() == 'Remove from cart' ? 'Add to cart' : 'Remove from cart');
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
					cartProducts = '<tr><td class="product-name">' + productName + '</td>' +
									'<td class="product-image"><img src="' + productImage + '" style="height: 70px;"></td>' +
						  			'<td class="product-price">' + productPrice + '</td>' +
						  			'<td><button type="button" class="btn btn-link remove-item" data-clicked="false">Remove</button></td></tr>';

					priceHolder.push(productPrice);
					$('#cart-table').append(cartProducts);
			});

			// if remove item link is clicked, reset local storage item to new array
			$('.remove-item').on('click', function(){
				var itemName = $(this).closest('tr').find('.product-name').html(),
					clicked = true,
					removeSingleItem = cartObj.filter(function(el) {
						return el.item !== itemName;
					});

				if (clicked === true){
					cart = removeSingleItem;

					$(this).closest('tr').remove();
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
			} else {
				$('#cart-total').append('0');
			};
		},
		emptyCart: function() {
			$('#cart-table tr:nth-child(1)').nextAll().remove();
			$('#cart-total').empty();
			localStorage.clear();
		},
		checkout: function(){},
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
				console.log(str + 'cannot be converted into a number');
				return false;
			}
		},
		_sum: function(total, num) {
			return total + num;
		}
	};

	PS.init();

}(window, document, jQuery));