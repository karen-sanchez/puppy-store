(function (w, d, $) {

	var PS = {
		init: function(){
			this.cacheDOM();
			this.homepage();
			this.productsPage();
			this.productsModal();
			this.bindEvents();
		},
		cacheDOM: function(){
			// if a selector is used > 1 add it to cacheDOM
			this.$puppyProduct = $('.product-info');
		},
		bindEvents: function(){
			// binding events in modular js changes the 'this' context
			$('.modal-btn').on('click', this.productsModal);
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

			// replace the img src in each carousel item andn give credit to photographer
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
			// wrap a 'row' class to every 3 puppyProduct batch
			for(var i = 0; i < this.$puppyProduct.length; i+=3) {
				this.$puppyProduct.slice(i, i+3).wrapAll('<div class="row"></div>');
			};

			this.$puppyProduct.addClass('col-sm');

			// appending author-credit codes to each profile link
			$('.author-credit').each(function(){
				var currentUrl = $(this).children().attr('href'),
					newUrl = currentUrl + utm;

					$(this).children().attr('href', newUrl);
			});
		},
		productsModal: function(){
			// get new image src from click event
			var newSrc = $(this).next().find('.modal-img').attr('href');		
			$('.modal-content').children().attr('src', newSrc);
		}
	};

	PS.init();

}(window, document, jQuery));