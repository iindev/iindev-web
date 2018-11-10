/*
 *	To allow :active styles to work in CSS on a page in Mobile Safari
 */
try{document.addEventListener("touchstart",function(){},true);}catch(e){}


/*
 *	jQuery
 */
;(function($){
	$(function(){
		var $header = $('#header');
		$('#headSearch').click(function(){
			$header.hasClass('headSearchOpen') ? $header.removeClass('headSearchOpen') : $header.addClass('headSearchOpen');
		})

		$('#headMobiMenuOpener').click(function(){
			$header.hasClass('headMobiMenuOpen') ? $header.removeClass('headMobiMenuOpen') : $header.addClass('headMobiMenuOpen');
		})

		// mobile nav
		$leadNav = $('#leadNav')
		$leadNav.find('.lev1').click(function(e){
			e.preventDefault();
			if( !$('#headMobiMenuOpener').is(':visible') ) return false;
			$leadNav.addClass('mobiSubActive').find('>.mobiActive').removeClass('mobiActive');
			$(this).parent().addClass('mobiActive')
		})
		$leadNav.find('.left > a').click(function(e){
			e.preventDefault();
			$leadNav.find('>.mobiActive').removeClass('mobiActive');
			$leadNav.removeClass('mobiSubActive')
			// $(this).parent().addClass('active')
		})

		// Mobile Footer Nav
		$('#footerLinks .linkhead').click(function(){
			$(this).parent().toggleClass('active');
		})


		//	Product Detail Page Images
		
		$prodBigImg = $('#prodBig');
		$prodThumbs = $('#prodThumbs');

		// Set The first Image
		$prodBigImg.attr('src', $prodThumbs.find('.item:eq(0)').addClass('active').find('.thumb').attr('src') );

		// Now, change the big image with thumb click
		$prodThumbs.find('.item').click(function(){
			$prodBigImg.attr('src', $(this).find('.thumb').attr('src') );
			$(this).siblings('.active').removeClass('active')
			$(this).addClass('active')
		})

		$('.selectEnfold > .select').each(function(){
			this.nextElementSibling.textContent = this.options[this.selectedIndex].text;
			$(this).change(function(){
				this.nextElementSibling.textContent = this.value;
			})
		})

	})	// End ready function.

	$(window).load(function() {
		$('.flexslider').flexslider({
			animation: "fade"
			,slideshow: true
			,controlNav: false
			,slideshowSpeed: 4000
			,prevText: ""
			,nextText: ""
			,init: function(){$('#home-slider').show()}
		});
	});

})(jQuery)	// End jQuery Shield
