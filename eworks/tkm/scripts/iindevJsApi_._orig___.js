/* Enabling support for new HTML5 tags for IE6, IE7 and IE8 */
if(navigator.appName == 'Microsoft Internet Explorer' ){
	if( ( navigator.userAgent.indexOf('MSIE 6.0') >= 0 ) || ( navigator.userAgent.indexOf('MSIE 7.0') >= 0 ) || ( navigator.userAgent.indexOf('MSIE 8.0') >= 0 ) ){
		document.createElement('header')
		document.createElement('nav')
		document.createElement('section')
		document.createElement('aside')
		document.createElement('footer')
		document.createElement('article')
				
		document.createElement('hgroup')
		document.createElement('figure')
		document.createElement('figcaption')
	}
}

// pngfixing for ie6
if( ( navigator.appName == 'Microsoft Internet Explorer' ) && ( navigator.userAgent.indexOf('MSIE 6.0') >= 0 ) ){
DD_belatedPNG.fix('img, p, a, a img, input, h1, h2, h3, h4, h5, h6, span, em, cite, dfn, div, ul, ul li, article, aside, canvas, caption, figure, figcaption, footer, hgroup, header, nav, section');
}



// Loading Cufon
Modernizr.load([
	{load: [
		'js!http://cdnjs.cloudflare.com/ajax/libs/cufon/1.09i/cufon-yui.js',
		'js!scripts/Caecilia-heavy_850.font.js'],
		complete: function(){
			Cufon.replace('.cufonTxt-Caecilia-heavy,.section h2,.section h3')
		}
	},
	
	{load: 'js!scripts/Caecilia-light_300.font.js',
		complete: function(){
			Cufon.replace('.cufonTxt-Caecilia-light')
		}
	},
	{load: 'js!scripts/Futura-light_300.font.js',
		complete: function(){
			Cufon.replace('.cufonTxt-Futura-light,#services-categories-description ul li')
		}
	},
	{load: 'js!scripts/Caecilia-roman_400.font.js',
		complete: function(){
			Cufon.replace('.cufonTxt-Caecilia-roman');
			Cufon.now()
		}
	},
	{load: 'js!http://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.3/jquery.easing.min.js'}
]);



;(function($){
	$(function(){
		
		// Common focus and blur effect ( hide / show field value ).
		$('input:text,input:password,textarea').focus(function(){if(this.value==this.defaultValue){this.value=''}})
		$('input:text,input:password,textarea').blur(function(){if(!this.value){this.value=this.defaultValue;}})
		
		if (window.PIE) {
			$('.gradient, .rounded, .shadow, div.header li').each(function() {
				PIE.attach(this);
			});
		}
		
		// Services tabs function begin
			
		// Tabshow functions begins
		var $tab_item				= false
		var presentlyRunning 		= false
		var presentlyShownItem 		= 0
		var totalItemCount			= $('#services-categories-description > ul').length
		var maxItemNo 				= totalItemCount - 1
		var $tab_item				= $('#services-categories-description > ul')
		var $tab_ul 				= $('#services-categories > ul')
		
		
		// Show the first item
		$tab_item.hide()
		$tab_item.eq(0).fadeIn(0)
		$tab_ul.find('>li').eq(0).addClass('active')
		
	
		$('#right-scroll-btn').click(function(){
			if(presentlyRunning) return false
			showParticularItems( (presentlyShownItem == maxItemNo ? 0 : presentlyShownItem+1))
		})
		
		$('#left-scroll-btn').click(function(){
			if(presentlyRunning) return false
			showParticularItems( (presentlyShownItem == 0 ? maxItemNo : presentlyShownItem-1) )
		})
		
		$tab_ul.find('>li').each(function(i){
			$(this).click(function(){
				if($(this).hasClass('active')) return false
				showParticularItems( i )
			})
		})
		
		function showParticularItems(itemToShow){
			presentlyRunning = true
			$tab_item.eq(presentlyShownItem).hide()
			
			$tab_ul.find('li.active').removeClass('active')
			$tab_ul.find('li').eq(itemToShow).addClass('active')
			
			$tab_item.eq(itemToShow).show()
			presentlyShownItem = itemToShow
			presentlyRunning = false
		
		}
		// Ending Services tabs function.
		
		var tagToScroll = navigator.userAgent.indexOf('WebKit') > -1 ? 'body' : 'html'
		
		var $homeInner = $('#home-inner')
		
		var $tree2		= $('#tree2')
		var $tree3		= $('#tree3')
		var $tree4		= $('#tree4')
		var $tree5		= $('#tree5')
		var $treeTxt	= $('#tree-txt')
		var $dwnArrow	= $('#down-arrow')
		
		var scrolledAmount = 0
		// var lastActiveSection = "home"
		
		// var isiPad = navigator.userAgent.match(/iPad/i) != null;
		var windowHeight, treeTxtDistance, homeScrollAmount
		
		function init(){
			windowHeight = $(window).height()
			$homeInner.height( windowHeight > 768 ? windowHeight : 768 )
			
			treeTxtDistance = windowHeight - ( windowHeight < 768 ? (windowHeight - 400) : 382 )
			$treeTxt.css({'height' : treeTxtDistance, 'bottom' : -treeTxtDistance})
			
			homeScrollAmount = windowHeight + 2500
			
			$('#home').height( homeScrollAmount )
			$('#contact').height( $('#contact').height() < windowHeight ? windowHeight : $('#contact').height())
		}
		
		init()
		$(window).resize(function(){init()})
		
		$(window).scroll(function(){
			scrolledAmount = $(window).scrollTop()
			
			if(scrolledAmount < 2500 ){
				$homeInner.css({'position' : 'fixed'})
				$tree2.stop().animate({'bottom' :  scrolledAmount < 1000 ? scrolledAmount * 0.339 - 339 : 0}, 150)
				$tree3.stop().animate({'bottom' :  scrolledAmount < 2500 ? scrolledAmount * 0.16 - 400 : 0}, 200)
				$tree4.stop().animate({'bottom' :  scrolledAmount < 394 ? scrolledAmount * 0.8324 - 328 : 0}, 150)
				$tree5.stop().animate({'bottom' :  scrolledAmount < 1500 ? scrolledAmount * 0.2233 - 335 : 0}, 150)
				$treeTxt.stop().animate({'bottom' :  scrolledAmount < 1500 ? scrolledAmount * ( treeTxtDistance / 1500 ) - treeTxtDistance : 0}, 150)
				$dwnArrow.stop().animate({'opacity' :  (1 - scrolledAmount / 1500)}, 150)
			}
			else{
				$homeInner.css({'position' : 'absolute'})
			}
			
			if( scrolledAmount < ( $('#about').offset().top - 62 ) ){
				$('#nav li.active').removeClass('active')
				$('#home-nav').addClass('active')
			}
			else if( scrolledAmount > ( $('#about').offset().top - 62 ) && scrolledAmount < ( $('#services').offset().top -62 )){
				$('#nav li.active').removeClass('active')
				$('#about-nav').addClass('active')
			}
			else if( scrolledAmount > ( $('#services').offset().top - 62 ) && scrolledAmount < ( $('#clients').offset().top - 62 )){
				$('#nav li.active').removeClass('active')
				$('#services-nav').addClass('active')
			}
			else if( scrolledAmount > ( $('#clients').offset().top - 62 ) && scrolledAmount < ( $('#contact').offset().top - 62 )){
				$('#nav li.active').removeClass('active')
				$('#clients-nav').addClass('active')
			}
			else{
				$('#nav li.active').removeClass('active')
				$('#contact-nav').addClass('active')
			}
		})
		
		$dwnArrow.click(function(){
			$(tagToScroll).stop().animate({ scrollTop: 2500 }, 700, 'easeInOutSine')
		})	
		
		var clickedRel
		$('#nav li, #logo').click(function(e){
			e.preventDefault()
			if($(this).hasClass('active')) return false;
			clickedRel = $(this).attr('rel')
			// $(tagToScroll).stop().animate({ scrollTop: $( $(this).attr('rel') ).offset().top }, 700)
			$(tagToScroll).stop().animate({ scrollTop: $( clickedRel ).offset().top }, ( clickedRel == '#home' ? 1400 : 700 ) )
		})
		

	})// End ready function.
	

})(jQuery)