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


var page_scroll_speed = 600


;(function($){








// Slider

$.fn.iindevFadeSlider = function( options ){

	var st = $.extend({
		auto				: true,
		speed				: 400,
		interval			: 4000,
		pagination			: 'div.slider-pagination',
		next				: 'div.slider-right-btn',
		prev				: 'div.slider-left-btn',
		pagiClickAutoStop	: true,
		hoverToPause		: true,
		instantNext			: true,
		complete			: null
	}, options);

	var $slider
	var totalItems = 0
	var presentlyShown = 0
	var sliderStopped = false
	var sliderIntervalPtr
	var currentlyRunning = false

	// Public method
	this.showAny = function(arg){
		//
	}

	function init($this){
		$slider = $this.find('div.sliderInner')

		$slider.height( $slider.find('div.leaf:eq(0)').height() )
		$slider.find('div.leaf').css({'z-index':2, 'position':'absolute'}).hide()
		$slider.find('div.leaf:eq(0)').css({'z-index':10,'position':'relative'}).show()
		$slider.css({'height':'auto'})

		totalItems = $slider.find('div.leaf').length

		if(st.pagination){
			var $paginationContainer = st.pagination == 'div.slider-pagination' ? $this.find(st.pagination) : $(st.pagination)

			var $pagination = '<ul class="pagination-bullet"><li class="active"></li>'
			for( var j=0; j<totalItems-1; j++ ){
				$pagination += '<li></li>'
			}
			$pagination += '</ul>'
			$paginationContainer.html($pagination)
			$pagination = $paginationContainer.find('>ul')

			if( totalItems < 2 ) return false

			$pagination.find('li').each(function(i){
				$(this).click(function(){
					if( $(this).hasClass('active') || st.currentlyRunning ) return false
					showParticular(i)
					if(st.pagiClickAutoStop) {clearInterval(sliderIntervalPtr); sliderStopped = true}
				})
			})
		}
		else{ if( totalItems < 2 ) return false }

		if(st.next){
			var $nextButton = st.next == 'div.next-button' ? $this.find(st.next) : $(st.next)
			$nextButton.each(function(i){
				$(this).click(function(e){
					e.preventDefault()
					if(st.currentlyRunning) return false
					if(!sliderStopped) clearInterval(sliderIntervalPtr)
					showNext()
				})
			})
		}

		if(st.prev){
			var $prevButton = st.next == 'div.prev-button' ? $this.find(st.prev) : $(st.prev)
			$prevButton.each(function(){
				$(this).click(function(e){
					e.preventDefault()
					if(st.currentlyRunning) return false
					if(!sliderStopped) clearInterval(sliderIntervalPtr)
					showParticular( presentlyShown == 0 ? totalItems - 1 : presentlyShown - 1 )
				})
			})
		}

		function showParticular(nextItem){
			$slider.find('div.leaf').eq(presentlyShown).fadeOut(st.speed,function(){
				$(this).css({'z-index':2, 'position':'absolute'})
			})

			if(st.pagination) {$pagination.find('li.active').removeClass('active');$pagination.find('li').eq(nextItem).addClass('active');}

			$slider.animate({'height' : $slider.find('div.leaf').eq(nextItem).height()},st.speed)

			st.currentlyRunning = true
			$slider.find('div.leaf').eq(nextItem).fadeIn(st.speed, function(){
				presentlyShown = nextItem
				$(this).css({'z-index':10, 'position':'relative'})
				$slider.css({'height':'auto'})
				st.currentlyRunning = false
			})
		}

		function showNext(){ showParticular( presentlyShown == totalItems - 1 ? 0 : presentlyShown + 1 ) }

		if(st.auto) sliderIntervalPtr = setInterval(showNext,st.interval)
		if(st.auto && st.hoverToPause){
			$slider
				.mouseenter(function(){ if(!sliderStopped) clearInterval(sliderIntervalPtr) })
				.mouseleave(function(){ if(!sliderStopped){if(st.instantNext) showNext();sliderIntervalPtr = setInterval(showNext,st.interval)} })
		}
	}

	return this.each( function(){

		init($(this))

		if ( $.isFunction( st.complete ) ) {
			st.complete.call( this );
		}
	});
}

	// Ajax Form Validation and submit
	$.fn.iindevFormHandle = function( options ){

		var st = $.extend({
			 ajax						: true	// Post the form with Ajax or not
			,showErrorMsg				: true	// Show the errors or not
			,submitForm					: true	// Submit the form or prevent it from getting submitted
			,errorMsgCont				: 'div.iErrorMsgCont'	// The wrapper container of the error msg for the particular field
			,errorTextCont				: 'div.error-text'	// The container of the error msg text
			,inputWrapperErrorClassName	: 'iFieldError'	// Error Class to be set to the immediate wrapper of the input
			,emptyFieldErrorMsg			: '#fieldName# cannot be empty.'	// Error MSG test to show for empty field
			,dataErrorToSuccessClassName: 'iGood'	// Class to set once the user fix the error
			,sucessMsgHideDelay			: 500	// Hide the field success message after 500ms
			,formActionUrl				: null	// Set the action url of the form to be submitted
			,beforeAjaxSubmit			: null	// User Function >> All tests passed. Code to run just before posting the form with Ajax.
			,customCheck				: null	// User Function >> Custom check for any particular field.
			,showResult					: null	// User Function >> Show the response data received from server.
			,afterAjaxComplete			: null	// User Function >> Things to do after the Ajax call end.
			,complete					: null	// User Function

			//	File releated	//
			,fileAjaxUpload				: false	// To enable Ajax File Upload
			,fileAjaxformActionUrl		: null	// Server handler to process the Ajax uploaded files.
												// Keeping it null won't make problems as the form file also got options in html to setup the url
			,fileUploadOnSelect			: true	// Start uploading immediately after selecting the files
			,fileUploadOnBtnClick		: false	// Start uploading after the upload button clicked
			,fileMaxFileSize			: 2048
			,fileAllowedMimeTypes		: null	// Array containing the list of allowed file mimeTypes
			,fileUploadStarts			: null	// User Function >> Tasks to do just before upload starts.
			,fileUploadPercent			: null	// User Function >> Code to help file upload progress or progress bar. Browser dependent issue. So, checks needed if progress value is passed.
			,fileUploadEnds				: null	// User Function >> Tasks to do just after file upload completed.
			,fileUploadError			: null	// User Function
			,fileAjaxComplete			: null	// User Function
		}, options);

		var self = this
		this.pubSt = st
		var $formElm
		var $formFile, $activeFile
		var isAjaxUploadSupported = true
		var iframe, activeiframeForm

		this.extend = function( externalFunction ){ if(externalFunction) externalFunction() }
		this.showError = function(elm,msg){
			if(st.showErrorMsg)	elm.parent().find(st.errorTextCont).html( msg ).parent().stop().fadeIn(300)
			elm.parent().removeClass(st.dataErrorToSuccessClassName).addClass(st.inputWrapperErrorClassName)
		}
		this.hideError = function( elm ){
			if( elm.parent().hasClass(st.inputWrapperErrorClassName) ) {
				if(st.showErrorMsg){
					if( !elm.attr('dataErrorToSuccessMsg') ) elm.parent().find(st.errorMsgCont).stop().fadeOut(300)
					else elm.parent().addClass(st.dataErrorToSuccessClassName).find(st.errorTextCont).html(elm.attr('dataErrorToSuccessMsg'))
				}
				elm.parent().removeClass(st.inputWrapperErrorClassName)
			}
		}

		this.selectCheck = function(elm){ if(elm.find('option:selected').attr('value') == undefined)return false;return true }

		var checks = []
		var testResult = true

		function validateItem(elm){
			checks = []
			testResult = true

			checks = elm.attr('dataValidations').replace(/^\s+|\s+$/g,'').split(" ");
			elm.attr('validationTookPlace','yes')

			$.each(checks, function(i){
				if(testResult){
					if(checks[i] == 'emptyCheck'){
						if(testResult = Boolean(elm.val().replace(/^\s+|\s+$/g,'').length)) self.hideError(elm)
						else self.showError(elm, st.emptyFieldErrorMsg.replace("#fieldName#",elm.attr('dataFieldName')))
					}
					else if(checks[i] == 'emailCheck'){
						if(testResult = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(elm.val())) self.hideError(elm)
						else self.showError(elm,elm.attr('dataErrorMsg'))
					}
					else if(checks[i] == 'checkBoxCheck'){
						if(testResult = elm.is(':checked')) self.hideError(elm)
						else self.showError(elm,elm.attr('dataErrorMsg'))

					}
					else if(checks[i] == 'selectCheck'){
						if(testResult = self.selectCheck(elm)) self.hideError(elm)
						else self.showError(elm,elm.attr('dataErrorMsg'))
					}
					else if(checks[i] == 'customCheck'){
						if(testResult = st.customCheck(elm)) self.hideError(elm)
						else self.showError(elm,(elm.attr('dataCustomErrorMsg')?elm.attr('dataCustomErrorMsg'):elm.attr('dataErrorMsg')))
					}
				}
			})
			return testResult
		}

		function uploadFiles($file, iframeForm){
			if($file.hasClass('uploading')) return false
			$file.addClass('uploading')

			var $progressBar = $file.attr('progressBarPtr')
			if($progressBar) $progressBar = $($progressBar);

			if(st.fileUploadStarts) st.fileUploadStarts($file, iframeForm)

			if(isAjaxUploadSupported){
				var fData = new FormData();
				for(var i = 0; i < $file[0].files.length; i++){
					fData.append($file.attr('name'), $file[0].files[i], $file[0].files[i].name);
				}

				$.ajax({
					xhr: function(){
						var xhr = new window.XMLHttpRequest();
						if($progressBar){
							xhr.upload.addEventListener("progress", function(evt){
								if (evt.lengthComputable && st.fileUploadPercent) st.fileUploadPercent(parseInt((evt.loaded / evt.total)*100),$progressBar);
							}, false);
						}
						return xhr;
					}
					,type: "POST"
					,url: (st.fileAjaxformActionUrl ? st.fileAjaxformActionUrl : $file.attr("ajaxUploadHandlerUrl"))
					,data: fData
					,dataType: 'json'
					,cache: false
					,contentType: false
					,processData: false
					,success: function(jsonResp){ if(st.fileUploadEnds) st.fileUploadEnds(jsonResp,$progressBar) }
					,complete: function(){
						$file.removeClass('uploading')
						if(st.fileAjaxComplete) st.fileAjaxComplete($file, iframeForm)
					}
				})
			}
			else{
				// Ajax upload not surpported, go for iframe alternative
				$activeFile = $file
				activeiframeForm = iframeForm

				if($progressBar && st.fileUploadPercent) st.fileUploadPercent(null,$progressBar);
				iframeForm.submit();
			}
		}

		function init($this){
			// Embade keyup and blur events
			$formElm = $this.find('*[dataValidations]')
			$formElm.each(function(){
				if($(this).attr('type') == 'checkbox'){
					$(this).click(function(){ if($(this).attr('validationTookPlace')) validateItem($(this)) })
				}
				else if($(this).attr('type') == 'SELECT') {
					$(this).change(function(){ if($(this).attr('validationTookPlace')) validateItem($(this)) })
				}
				else {
					$(this).keyup(function(){ if($(this).attr('validationTookPlace')) validateItem($(this)) })
				}
			})
			$formElm.blur(function(){
				if( validateItem($(this)) ){
					if( $(this).parent().hasClass(st.dataErrorToSuccessClassName) ){
						$(this).parent().find( st.errorMsgCont).delay(st.sucessMsgHideDelay).fadeOut(300,function(){
							$(this).parent().removeClass(st.dataErrorToSuccessClassName)
						})
					}
				}
			})

			if(st.fileAjaxUpload){
				$formFile = $this.find(':file[ajaxUpload]')
				isAjaxUploadSupported = "multiple" in $formFile.eq(0)[0] && typeof File != "undefined" && typeof FormData != "undefined" && typeof (new XMLHttpRequest()).upload != "undefined"

				if(!isAjaxUploadSupported){
					// IE7, 8 Alternative, also works for IE9
					try{
						iframe = document.createElement('<iframe name="file-uploader-iframe">');
					}catch(ex){
						iframe = document.createElement('iframe');
						iframe.name='file-uploader-iframe';
					}
					$(iframe).attr({'width':'0','height':'0','border':'0','src':'javascript:false;'}).css('display','none')
					document.body.appendChild(iframe)

					// receive Iframe Response
					iframe.onload = function(){
						if(!$activeFile) return true
						$activeFile.removeClass('uploading')
						// Collect the response here
						try{ if(st.fileUploadEnds) st.fileUploadEnds(eval($(iframe).contents().find("body").html()),$activeFile.attr('progressBarPtr')?$($activeFile.attr('progressBarPtr')):null);
						}catch(err){}

						if(st.fileAjaxComplete) st.fileAjaxComplete($activeFile, activeiframeForm)
					}

					// Relocate the new form and input file with the change of the original file position
					var $linkedFile
					$(window).resize(function(){
						$('form.iefileuploader').each(function(){
							$linkedFile = $('input.'+$(this).attr('usedFor'))
							$(this).css({'left':$linkedFile.offset().left,'top':$linkedFile.offset().top})
						})
					})
				}

				$formFile.each(function(i){
					var $file = $(this)
					var fileInputName = $file.attr('name')

					if(fileInputName && (fileInputName.lastIndexOf('[]')!=(fileInputName.length - 2))) $file.attr('name', fileInputName+'[]');

					if(isAjaxUploadSupported){ if(!$file.attr('multiple'))$file.attr('multiple',''); }
					else{
						// Disabling the original file input for IE9 and below.
						// $file[0].disabled = true

						$file.addClass('original'+i)
						// IE8 requires document.createElement for form. Works for IE9 though.
						var iframeForm = document.createElement("form");
						$(iframeForm).attr({'target':'file-uploader-iframe','method':'post','enctype':'multipart/form-data','encoding':'multipart/form-data','action':(st.fileAjaxformActionUrl ? st.fileAjaxformActionUrl : $file.attr("ajaxUploadHandlerUrl")),'class':'iefileuploader','usedFor':'original'+i})
						.css({'opacity':0,'position':'absolute','z-index':999,'left':$file.offset().left,'top':$file.offset().top})
						document.body.appendChild(iframeForm);

						var iframeFormFile = document.createElement('input')
						$(iframeFormFile).attr({'type':'file','name':$file.attr('name')}).css({'width':$file.width(),'height':$file.height()})

						iframeForm.appendChild(iframeFormFile)
						iframeFormFile = iframeForm.childNodes[0]
					}

					if(st.fileUploadOnSelect){
						(isAjaxUploadSupported ? $file : $(iframeFormFile)).change(function(){
							if(st.fileUploadStarts) st.fileUploadStarts();uploadFiles($file,iframeForm?iframeForm:null)
						})
					}
					else if(st.fileUploadOnBtnClick && $file.attr('uploadBtnPtr')){
						$($file.attr('uploadBtnPtr')).click(function(){
							if(st.fileUploadStarts) st.fileUploadStarts();uploadFiles($file,iframeForm?iframeForm:null)
						})
					}
				})
			}

			// Tasks releated after initializing Submit
			if( st.submitForm ){
				$this.submit(function(e){
					$formElm.each(function(){ validateItem($(this)) })

					if( $this.find('.'+st.inputWrapperErrorClassName).length)return false;
					else if(!st.ajax)return true;
					else{
						if(st.beforeAjaxSubmit) st.beforeAjaxSubmit()
						$.ajax({
							 type: "POST"
							,url: (st.formActionUrl ? st.formActionUrl : $(this).attr("action"))
							,data: $(this).serialize()
							,success: function(result){ if(st.showResult) st.showResult(result) }
							,complete: function(result){ if(st.afterAjaxComplete) st.afterAjaxComplete(result) }
						})
						return false;
					}
				})
			}
			else{
				$this.submit(function(){return false;})
			}
		}

		return this.each( function(){
			init( $(this) )
			if ( $.isFunction( st.complete ) )  st.complete.call( this );
		});
	}

$(function(){

		// Begin input common focus and blur for value.

		// PIE for < 9
		if (window.PIE){$('.gradient, .rounded, .shadow').each(function(){PIE.attach(this)});}

		// slider slider slider slider
		$('#home-slider').iindevFadeSlider({
			next		: 'div.next-btn',
			prev		: 'div.prev-btn',
			instantNext : false
		})

		// Clients slider
		$('#clients-slider').iindevFadeSlider({
			next		: false,
			prev		: false,
			instantNext : false,
			pagination	: '#pagination'
		})

		// mobile nav
		$mobileNavHandler = $('#nav-toggle')
		$mobileNavUl = $('#mobile-nav')

		$mobileNavHandler.click(function(){
			$mobileNavUl.slideToggle()
		})

		$mobileNavUl.find('>li>a').each(function(){
			if( $(this).siblings('ul').length ) $(this).addClass('hasSubNav')
			$(this).click(function(e){
				if($(this).hasClass('hasSubNav')){
					e.preventDefault()
					$(this).toggleClass('expand').siblings('ul').slideToggle()
				}
				else return true
			})
		})

		// Action - create / register account
		$('#contact-form-submit').iindevFormHandle({
			 ajax 					: true
			,showErrorMsg			: true
			,formActionUrl			: 'contact-iindev.php'
			,showResult	: function(result){
				if (result == 'success'){
					$('#contactSuccessMsg').fadeIn(300);
					$('#contactSuccessMsg').find('div.alert-message').text($('#contactSuccessMsg').find('div.alert-message').attr('dataSuccessMsg'))
					$('#contact-form-submit input,#contact-form-submit textarea').attr("disabled", true)
					$('#contact-form-submit').addClass('inActive')
				}
			}
		})

		// Close button action for modals
		//$('div.modal-close-btn').click(function(){$('#overlay_layer,div.modal-wrap,#AccountSuccessMsg').fadeOut(400) })
		$('div.close-button').click(function(){$('div.info-alert').fadeOut(400) })



		if( (navigator.appName == 'Microsoft Internet Explorer') || (navigator.userAgent.indexOf('Safari')) ){
			if( ( navigator.userAgent.indexOf('MSIE 9.0') >= 0 ) || (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) ){
				$('body').addClass('tri-circle');
			}
		}

		/*if($('#scroll-top').length){var tagToScroll=navigator.userAgent.indexOf(' AppleWebKit/')!==-1?'body':'html';var $scrolltoTop=$('#scroll-top');$scrolltoTop.click(function(e){e.preventDefault();$(tagToScroll).stop().animate({scrollTop:0},600,'easeInOutSine');});if($(window).height()>$('body').height())$scrolltoTop.hide();}*/


	})// End ready function.

$(window).load(function(){
		/*var $bannerCircles = $('#banner-circles')
		$bannerCircles.find('>div:eq(0)').addClass('drop-circle')
		setTimeout(function(){$bannerCircles.find('>div:eq(1)').addClass('drop-circle')},1000)
		setTimeout(function(){$bannerCircles.find('>div:eq(2)').addClass('drop-circle')},2000)*/

		// Add the css
		// $('<link rel="stylesheet" type="text/css" href="css/style.css" >').appendTo("head");
		$('<link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Roboto+Condensed:300italic,400italic,700italic,400,300,700" >').appendTo("head");

		$.ajax({
			url: 'css/effects.min.css',
			dataType: 'text',
			success: function(data) {
				$('<style type="text/css">\n' + data + '</style>').appendTo("head");

				var $bannerCircles = $('#banner-circles')
				$bannerCircles.find('>div:eq(0)').addClass('drop-circle')
				setTimeout(function(){$bannerCircles.find('>div:eq(1)').addClass('drop-circle')},1000)
				setTimeout(function(){$bannerCircles.find('>div:eq(2)').addClass('drop-circle')},2000)
			}
		});
	})

})(jQuery)

//Quad, Cubic, Quart, Quint, Sine, Expo, Circ, Elastic, Back, Bounce
jQuery.easing["jswing"]=jQuery.easing["swing"];jQuery.extend(jQuery.easing,{def:"easeOutQuad",swing:function(a,b,c,d,e){return jQuery.easing[jQuery.easing.def](a,b,c,d,e)},easeInQuad:function(a,b,c,d,e){return d*(b/=e)*b+c},easeOutQuad:function(a,b,c,d,e){return-d*(b/=e)*(b-2)+c},easeInOutQuad:function(a,b,c,d,e){if((b/=e/2)<1)return d/2*b*b+c;return-d/2*(--b*(b-2)-1)+c},easeInCubic:function(a,b,c,d,e){return d*(b/=e)*b*b+c},easeOutCubic:function(a,b,c,d,e){return d*((b=b/e-1)*b*b+1)+c},easeInOutCubic:function(a,b,c,d,e){if((b/=e/2)<1)return d/2*b*b*b+c;return d/2*((b-=2)*b*b+2)+c},easeInQuart:function(a,b,c,d,e){return d*(b/=e)*b*b*b+c},easeOutQuart:function(a,b,c,d,e){return-d*((b=b/e-1)*b*b*b-1)+c},easeInOutQuart:function(a,b,c,d,e){if((b/=e/2)<1)return d/2*b*b*b*b+c;return-d/2*((b-=2)*b*b*b-2)+c},easeInQuint:function(a,b,c,d,e){return d*(b/=e)*b*b*b*b+c},easeOutQuint:function(a,b,c,d,e){return d*((b=b/e-1)*b*b*b*b+1)+c},easeInOutQuint:function(a,b,c,d,e){if((b/=e/2)<1)return d/2*b*b*b*b*b+c;return d/2*((b-=2)*b*b*b*b+2)+c},easeInSine:function(a,b,c,d,e){return-d*Math.cos(b/e*(Math.PI/2))+d+c},easeOutSine:function(a,b,c,d,e){return d*Math.sin(b/e*(Math.PI/2))+c},easeInOutSine:function(a,b,c,d,e){return-d/2*(Math.cos(Math.PI*b/e)-1)+c},easeInExpo:function(a,b,c,d,e){return b==0?c:d*Math.pow(2,10*(b/e-1))+c},easeOutExpo:function(a,b,c,d,e){return b==e?c+d:d*(-Math.pow(2,-10*b/e)+1)+c},easeInOutExpo:function(a,b,c,d,e){if(b==0)return c;if(b==e)return c+d;if((b/=e/2)<1)return d/2*Math.pow(2,10*(b-1))+c;return d/2*(-Math.pow(2,-10*--b)+2)+c},easeInCirc:function(a,b,c,d,e){return-d*(Math.sqrt(1-(b/=e)*b)-1)+c},easeOutCirc:function(a,b,c,d,e){return d*Math.sqrt(1-(b=b/e-1)*b)+c},easeInOutCirc:function(a,b,c,d,e){if((b/=e/2)<1)return-d/2*(Math.sqrt(1-b*b)-1)+c;return d/2*(Math.sqrt(1-(b-=2)*b)+1)+c},easeInElastic:function(a,b,c,d,e){var f=1.70158;var g=0;var h=d;if(b==0)return c;if((b/=e)==1)return c+d;if(!g)g=e*.3;if(h<Math.abs(d)){h=d;var f=g/4}else var f=g/(2*Math.PI)*Math.asin(d/h);return-(h*Math.pow(2,10*(b-=1))*Math.sin((b*e-f)*2*Math.PI/g))+c},easeOutElastic:function(a,b,c,d,e){var f=1.70158;var g=0;var h=d;if(b==0)return c;if((b/=e)==1)return c+d;if(!g)g=e*.3;if(h<Math.abs(d)){h=d;var f=g/4}else var f=g/(2*Math.PI)*Math.asin(d/h);return h*Math.pow(2,-10*b)*Math.sin((b*e-f)*2*Math.PI/g)+d+c},easeInOutElastic:function(a,b,c,d,e){var f=1.70158;var g=0;var h=d;if(b==0)return c;if((b/=e/2)==2)return c+d;if(!g)g=e*.3*1.5;if(h<Math.abs(d)){h=d;var f=g/4}else var f=g/(2*Math.PI)*Math.asin(d/h);if(b<1)return-.5*h*Math.pow(2,10*(b-=1))*Math.sin((b*e-f)*2*Math.PI/g)+c;return h*Math.pow(2,-10*(b-=1))*Math.sin((b*e-f)*2*Math.PI/g)*.5+d+c},easeInBack:function(a,b,c,d,e,f){if(f==undefined)f=1.70158;return d*(b/=e)*b*((f+1)*b-f)+c},easeOutBack:function(a,b,c,d,e,f){if(f==undefined)f=1.70158;return d*((b=b/e-1)*b*((f+1)*b+f)+1)+c},easeInOutBack:function(a,b,c,d,e,f){if(f==undefined)f=1.70158;if((b/=e/2)<1)return d/2*b*b*(((f*=1.525)+1)*b-f)+c;return d/2*((b-=2)*b*(((f*=1.525)+1)*b+f)+2)+c},easeInBounce:function(a,b,c,d,e){return d-jQuery.easing.easeOutBounce(a,e-b,0,d,e)+c},easeOutBounce:function(a,b,c,d,e){if((b/=e)<1/2.75){return d*7.5625*b*b+c}else if(b<2/2.75){return d*(7.5625*(b-=1.5/2.75)*b+.75)+c}else if(b<2.5/2.75){return d*(7.5625*(b-=2.25/2.75)*b+.9375)+c}else{return d*(7.5625*(b-=2.625/2.75)*b+.984375)+c}},easeInOutBounce:function(a,b,c,d,e){if(b<e/2)return jQuery.easing.easeInBounce(a,b*2,0,d,e)*.5+c;return jQuery.easing.easeOutBounce(a,b*2-e,0,d,e)*.5+d*.5+c}})
