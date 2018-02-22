$(document).ready(function(){
	
	//////////////////////////////////
	// INDEX
	//////////////////////////////////
	var picsArray = [];

	// filter returned images by size, then push into picsArray
	$('.carousel-images').each(function() {  
		var imgSrc = $(this).find('img').attr('src'),
			imgHeight = $(this).find('.height').html(),
			maxHeight = 4000;

		if(imgHeight <= maxHeight){
			picsArray.push(imgSrc);
		};
	 }); 

	// replace the img src in each carousel item
	for(var i = 0; i < picsArray.length ; i++) {
		var image = '<div class="carousel-item">' +
					'<img src=" '+ picsArray[i] +' ">' +
					'</div>',
			indicators = '<li data-target="#puppy-carousel" data-slide-to="'+i+'"></li>';

		$(image).appendTo('.carousel-inner');
		$(indicators).appendTo('.carousel-indicators');
	};

	$('.carousel-item').first().addClass('active');
	$('.carousel-indicators > li').first().addClass('active');
	$('#puppy-carousel').carousel(); 

	//////////////////////////////////
	// PRODUCTS
	//////////////////////////////////

	var puppyProduct = $('.product-info');

	// wrap a 'row' class to every 3 puppyProduct batch
	for(var i = 0; i < puppyProduct.length; i+=3) {
		puppyProduct.slice(i, i+3).wrapAll('<div class="row"></div>');
	};

	$('.product-info').addClass('col-sm');

	// appending utm codes to each profile link
	$('.utm').each(function(){
		var currentUrl = $(this).children().attr('href'),
			utm = '?utm_source=puppy_store&utm_medium=referral',
			newUrl = currentUrl + utm;

			$(this).children().attr('href', newUrl);
	});

	//////////////////////////////////
	// PRODUCTS > MODAL
	//////////////////////////////////

	$('.modal-btn').on('click', function(){
		var newSrc = $(this).next().find('.modal-img').attr('href');		
		$('.modal-content').children().attr('src', newSrc);
	});

});