/*
 *	To allow :active styles to work in CSS on a page in Mobile Safari
 */
try{document.addEventListener("touchstart",function(){},true);}catch(e){}

/*
 *	jQuery Snipets
 */

;(function($){
	$(function(){

		var $body = $('body');

		//	Modal
		var $modalContainer = $('#modalContent');

		$('.modalOpener').click(function(e){
			e.preventDefault();
			$body.removeClass('initModal');
			$modalContainer.html( $(this).next('.modCont').html() );
			$body.hasClass('modalopen') ? '' : $body.addClass('modalopen');
			if( $modalContainer.find('a.switchTo').length > 0 ){
				$modalContainer.find('a.switchTo').click(function(e){
					e.preventDefault();
					$body.hasClass('modalopen') ? $body.removeClass('modalopen') : '';	// Close the modal
					if( $(this).data('switchto') == 'login' ) setTimeout(function(){ $('#modalOpenerSignin').click(); }, 250);
					else if( $(this).data('switchto') == 'signup' ) setTimeout(function(){ $('#modalOpenerSignup').click(); }, 250);
				})
			}
			if( $modalContainer.find('> .saap').length > 0 ) $modalContainer.find('> .saap').scheduleAppointment();
		})

		$('#btnModalClose').click(function(){$body.hasClass('modalopen') ? $body.removeClass('modalopen') : ''; });

		// Input effect ( text inputs )
		$('.inputeffectfold > .input').on('focus blur', function(e){
			if(e.type == 'focus') $(this).addClass('active');
			else{
				if( $(this).val().length === 0 ) $(this).removeClass('active');
			}

		})

		//	Load More Records...
		var $loadmore = '';
		$('.loadmore').click(function(){
			$loadmore = $(this);
			if( $(this).data('url') && $(this).data('container') ){
				$.ajax({
					url: $(this).data('url')
					,error: function() {
						//
					}
					,dataType: 'html'
					,success: function(data) {
						$( $loadmore.data('container') ).append(data)
					}
					,complete: function(data){
						// Complete
					}
					,method: 'GET'
					,cache: false
				});
			}

		});


		// User Account Dropdown
		$('.useraccount').click(function(){
			$('body').toggleClass('showMemberOverlay');
		})

		// Custom Select
		$('.selectEnfold > .select').each(function(){
			this.nextElementSibling.textContent = this.options[this.selectedIndex].text;
			$(this).change(function(){
				this.nextElementSibling.textContent = this.options[this.selectedIndex].text;
			})
		})


	})	// End ready function.

	/*
	 *	Plugin : Schedule an Appointment Tasks
	 **/
	$.fn.scheduleAppointment = function( options ){

		var st = $.extend({
			complete : null // function - to call after the code has run
		}, options);

		var self = this;

		this.extend = function( externalFunction ){ if(externalFunction) externalFunction() }

		function scheduleAppointmentTasks( $saap ){

			// Modal - Schedule an Appointment
			var $weekDays = $saap.find('.weekdays')

			$weekDays.find('.day').click(function(){
				if( $(this).hasClass('active') ) return false;
				else if( $(this).hasClass('close') ) return false;

				$weekDays.find('.active').removeClass('active');
				$(this).addClass('active')
			})

			// Day Slider
			var $dayBar = $saap.find('.dayBar'),
				$darBarPa = $dayBar.parent(),
				dayBarLeft = 0,

				dayBarWidth = $dayBar.width(),
				visibleWidth = $darBarPa.width(),

				$leftArrow = $weekDays.find('.arrow.left'),
				$rightArrow = $weekDays.find('.arrow.right');

			$dayBar.css({'left' : 0});
			$weekDays.find('.arrow.left').addClass('inactive');


			$leftArrow.click(function(){
				if( $(this).hasClass('inactive') ) return false;
				dayBarLeft = parseInt($dayBar.css('left')) + visibleWidth
				$dayBar.css({'left' : dayBarLeft });
				$rightArrow.removeClass('inactive');
				if( dayBarLeft >= 0) $(this).addClass('inactive')
			})

			$rightArrow.click(function(){
				if( $(this).hasClass('inactive') ) return false;
				dayBarLeft = parseInt($dayBar.css('left')) - visibleWidth
				$dayBar.css({'left' : dayBarLeft });
				$leftArrow.removeClass('inactive');
				if( ( Math.abs(dayBarLeft) + visibleWidth ) > dayBarWidth ) $(this).addClass('inactive')
			})

			$saap.find('.btnConfirmAppointmentStep1').click(function(){
				//	Do the form validation tasks as needed.
				// If satisfied, show the step 2
				$saap.find('.step1').removeClass('active').next('.step2').addClass('active');
			});

			$saap.find('.btnConfirmAppointmentStep2').click(function(){
				//	Do the form validation tasks as needed.
				// If satisfied, show the step 3
				$saap.find('.step2').removeClass('active').next('.step3').addClass('active');
			});

		}	// Ending Function scheduleAppointmentTasks

		function init($this){
			scheduleAppointmentTasks($this);
		}

		return this.each(function(){
			init($(this));
			if($.isFunction(st.complete)){ st.complete(this) }
		});
	}	// End Plugin : scheduleAppointment

})(jQuery)	// End jQuery Shield
