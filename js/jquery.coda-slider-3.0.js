// Utility for creating objects in older browsers
if ( typeof Object.create !== 'function' ) {
	Object.create = function( obj ) {
		function F() {}
		F.prototype = obj;
		return new F();
	};
}

(function( $, window, document, undefined ) {
	var Slider = {
		//initialize
		init: function( options, elem ) {
			var self = this;

			// Cache the element
			self.elem = elem;
			self.$elem = $( elem );

			// Cache the ID and class. This allows for multiple instances with any ID name supplied
			self.sliderId = '#' + ( self.$elem ).attr('id');
			
			// Set the options
			self.options = $.extend( {}, $.fn.codaSlider.options, options );
			
			// Cache the ID and class. This allows for multiple instances with any ID name supplied
			self.sliderId = '#' + ( self.$elem ).attr('id');

			// Variable for the % sign if needed (responsive), otherwise px
			self.pSign =  (self.options.responsive) ? '%' : 'px';
			
			// Build the tabs and navigation
			self.build();

			// Start auto slider
			if (self.options.autoSlide) {self.autoSlide();}

			self.events();

		},
		build: function() {
			var self = this;

			// Store current tab
			self.currentTab = self.options.firstPanelToLoad - 1;

			// Wrap the entire slider (backwards compatible)
			if ( $(self.sliderId).parent().attr('class') != 'coda-slider-wrapper' ) {$(self.sliderId).wrap('<div id="' + ( self.$elem ).attr('id') + '-wrapper" class="coda-slider-wrapper"></div>'); }
			
			// Add the .panel class to the individual panels (backwards compatable)
			self.panelClass = self.sliderId + ' .' + $(self.sliderId + " > div").addClass('panel').attr('class');

			// Wrap all panels in a div, and wrap inner content in a div (backwards ccompatible)
			$(self.panelClass).wrapAll('<div class="panel-container"></div>');
			if ( $(self.panelClass).children().attr('class') != 'panel-wrapper' ) { $(self.panelClass).wrapInner('<div class="panel-wrapper"></div>'); }
			self.panelContainer = ($(self.panelClass).parent());

			// If using fade transition, add the class here and disable other options.
			if (self.options.slideEaseFunction === "fade") {
				$(self.panelClass).addClass('fadeClass');
				self.options.continuous = false;
				$($(self.panelContainer).children()[self.currentTab]).css('display', 'block');
			}

			// Disable the autoheight for the first panel if responsive
			if (self.options.responsive) {
				// TODO allow for better floating when responsive
				if (self.options.dynamicArrows && !self.options.dynamicArrowsGraphical) {
					self.options.dynamicTabsAlign    = "center";
				}
				// This is needed to allow a smooth first panel height. It's later enabled.
				self.options.autoHeight = false;
			}

			// Apply starting height to the container
			if (self.options.autoHeight) { $(self.sliderId).css('height', $($(self.panelContainer).children()[self.currentTab]).height() + $(self.sliderId + '-wrapper .coda-nav-right').height() + self.pSign);	}

			// Build navigation tabs
			if (self.options.dynamicTabs) { self.addNavigation(); }

			// Build navigation arrows
			if (self.options.dynamicArrows) { self.addArrows(); }

			// Create a container width to allow for a smooth float right.
			self.totalSliderWidth = $(self.sliderId).outerWidth(true) + $($(self.sliderId).parent()).children('[class^=coda-nav-left]').outerWidth(true) + $($(self.sliderId).parent()).children('[class^=coda-nav-right]').outerWidth(true);
			$($(self.sliderId).parent()).css('width', self.totalSliderWidth);

			// Align navigation tabs
			if (self.options.dynamicTabs) { self.alignNavigation(); }

			// Clone panels if continuous is enabled
			if (self.options.continuous) {
				$(self.panelContainer).prepend($(self.panelContainer).children().last().clone());
				$(self.panelContainer).append($(self.panelContainer).children().eq(1).clone());
			}

			// Allow the slider to be clicked
			self.clickable = true;

			// Count the number of panels and get the combined width
			self.panelCount = (self.options.slideEaseFunction === 'fade') ? 1 : $(self.panelClass).length;
			self.panelWidth = $(self.panelClass).outerWidth(true);
			self.totalWidth = self.panelCount * self.panelWidth;
			

			// Create a variable for responsive setting
			if (self.options.responsive) { self.slideWidth = 100;}
			else { self.slideWidth = $(self.sliderId).width(); }

			// Puts the margin at the starting point with no animation. Made for both continuous and firstPanelToLoad features.
			// ~~(self.options.continuous) will equal 1 if true, otherwise 0
			if (self.options.slideEaseFunction != 'fade') { $(self.panelContainer).css('margin-left', ( -self.slideWidth * ~~(self.options.continuous)) + (-self.slideWidth * self.currentTab) + self.pSign ); }

			// Configure the current tab
			self.setCurrent(self.currentTab);

			// Apply the width to the panel container
			$(self.sliderId + ' .panel-container').css('width', self.totalWidth);

			// Make responsive (beta)
			if (self.options.responsive) {self.makeResponsive();}

		},

		addNavigation: function(){
			var self = this;
			var id =  ( self.$elem ).attr('id');
			// The id is assigned here to allow for responsive
			var dynamicTabs = '<div class="coda-nav"><ul id="' + ( self.$elem ).attr('id') + '-nav-ul"></ul></div>';
			var dropDownList = '<select id="' + ( self.$elem ).attr('id') + '-nav-select" name="navigation"></select>';

			// Add basic frame
			if (self.options.dynamicTabsPosition === 'bottom') { $(self.sliderId).after(dynamicTabs); }
			else{ $(self.sliderId).before(dynamicTabs); }

			// Add responsive navigation
			if (self.options.responsive) {$(self.sliderId + '-nav-ul').before(dropDownList);}

			// Add labels
			$.each(
				(self.$elem).find(self.options.panelTitleSelector), function(n) {
					$($(self.sliderId).parent()).find('.coda-nav ul').append('<li class="tab' + (n+1) + '"><a href="#' + (n+1) + '" title="' + $(this).text() + '">' + $(this).text() + '</a></li>');
				}
			);

			// TODO Add dropdown navigation for smaller screens if responsive
			if (self.options.responsive) {
				$.each(
					(self.$elem).find(self.options.panelTitleSelector), function(n) {
						$($(self.sliderId).parent()).find('.coda-nav select').append('<option value="tab' + (n+1) + '">' + $(this).text() + '</option>');
					}
				);
			}
		},

		alignNavigation: function() {
			var self = this;
			var arrow = (self.options.dynamicArrowsGraphical) ? '-arrow' : '';

			// Set the alignment, adjusting for margins
			if (self.options.dynamicTabsAlign != 'center') {
				$($(self.sliderId).parent()).find('.coda-nav ul').css(
					'margin-' + self.options.dynamicTabsAlign,
					// Finds the width of the aarows and the margin
						$($(self.sliderId).parent()).find(
							'.coda-nav-' +
							self.options.dynamicTabsAlign +
							arrow
						).outerWidth(true) + parseInt($(self.sliderId).css('margin-'+ self.options.dynamicTabsAlign), 10)
					);
				$($(self.sliderId).parent()).find('.coda-nav ul').css('float', self.options.dynamicTabsAlign); // couldn't combine this .css() with the previous??
			}
			self.totalNavWidth = $($(self.sliderId).parent()).find('.coda-nav ul').outerWidth(true);

			if (self.options.dynamicTabsAlign === 'center') {
				// Get total width of the navigation tabs and center it
				self.totalNavWidth = 0;
				$($(self.sliderId).parent()).find('.coda-nav li a').each(function(){self.totalNavWidth += $(this).outerWidth(true); });
				if ($.browser.msie) { self.totalNavWidth = self.totalNavWidth + (5);} // Simple IE fix
				$($(self.sliderId).parent()).find('.coda-nav ul').css('width', self.totalNavWidth + 1);
			}
		},

		addArrows: function(){
			var self = this;
			$(self.sliderId).parent().addClass("arrows");
			if(self.options.dynamicArrowsGraphical){
				$(self.sliderId).before('<div class="coda-nav-left-arrow" data-dir="prev" title="Slide left"><a href="#"></a></div>');
				$(self.sliderId).after('<div class="coda-nav-right-arrow" data-dir="next" title="Slide right"><a href="#"></a></div>');
			}
			else{
				$(self.sliderId).before('<div class="coda-nav-left" data-dir="prev" title="Slide left"><a href="#">' + self.options.dynamicArrowLeftText + '</a></div>');
				$(self.sliderId).after('<div class="coda-nav-right" data-dir="next" title="Slide right"><a href="#">' + self.options.dynamicArrowRightText + '</a></div>');
			}
		},

		makeResponsive: function(){
			var self = this;

			// Adjust widths and add classes to make responsive
			$(self.sliderId + '-wrapper').addClass('coda-responsive').css({
				'max-width': $(self.sliderId + ' .panel').outerWidth(true),
				'width': '100%'
			});
			$(self.sliderId + ' .panel-container').css('width', 100 * self.panelCount + self.pSign);
			$(self.sliderId + ' .panel').css('width', 100 / self.panelCount + self.pSign);
			$(self.sliderId).css('height', $($(self.panelContainer).children()[self.currentTab + ~~(self.options.continuous)]).css('height'));
			$(self.sliderId + '-nav-select').css('width', '100%');
			
			if (self.options.dynamicArrows || self.options.dynamicArrowsGraphical) {
				// Add padding to the top equal to the height of the arrows to make room for arrows, if enabled..
				$(self.sliderId).css('padding-top', $(self.sliderId + '-wrapper .coda-nav-right').css('height') );
			}

			// Enable autoslide again. (Need to eliminate the need for this)
			self.options.autoHeight = true;

			// Change navigation when the screen size is too small.
			if ( $(self.sliderId).width() < self.totalNavWidth ) {
				$(self.sliderId + '-nav-ul').css('display', 'none');
				$(self.sliderId + '-nav-select').css('display', 'block');
			}
			else { $(self.sliderId + '-nav-select').css('display', 'none'); }

			/**************************
			* Responsive Events
			**************************/

			// Change navigation if the user resizes the screen.
			$(window).bind('resize', function(){
				if ( $(self.sliderId).outerWidth() < self.totalNavWidth ) {
					$(self.sliderId + '-nav-ul').css('display', 'none');
					$(self.sliderId + '-nav-select').css('display', 'block');
				}
				else {
					$(self.sliderId + '-nav-ul').css('display', 'block');
					$(self.sliderId + '-nav-select').css('display', 'none');
				}
				// While resizing, set the width to 100%
				$(self.sliderId + '-wrapper').css('width', '100%');
				// Send to adjust the height
				self.transition();
			});

			// Do something when an item is selected from the select box
			$(self.sliderId + '-nav-select').change(function(){self.setCurrent(parseInt( $(this).val().split('tab')[1], 10) - 1 );});

			/*****************************
			* End Events
			******************************/


			// Match the slider margin with the width of the slider (better height transitions)
			$(self.sliderId + '-wrapper').css('width', $(self.sliderId).outerWidth(true));

		},

		events: function(){
			var self = this;
			// CLick arrows
			$($(self.sliderId).parent()).find('[class^=coda-nav-]').on('click', function(e){
				// These prevent clicking when in continuous mode, which would break it otherwise.
				if (!self.clickable && self.options.continuous) {return false;}
				self.setCurrent($(this).attr('class').split('-')[2]);
				if (self.options.continuous) {self.clickable = false;}
				return false;
			});
			// Click tabs
			$($(self.sliderId).parent()).find('[class^=coda-nav] li').on('click', function(e){
				if (!self.clickable && self.options.continuous) {return false;}
				self.setCurrent(parseInt( $(this).attr('class').split('tab')[1], 10) - 1 );
				if (self.options.continuous) {self.clickable = false;}
				return false;
			});
			// Click cross links
			$('[data-ref*=' + (self.sliderId).split('#')[1] + ']').on('click', function(e){
				if (!self.clickable && self.options.continuous) {return false;}
				self.setCurrent( parseInt( $(this).attr('href').split('#')[1] -1, 10 ) );
				if (self.options.continuous) {self.clickable = false;}
				return false;
			});
			// Click to stop autoslider
			$($(self.sliderId).parent()).find('*').on('click', function(e){
				if (!self.clickable && self.options.continuous) {
					if (self.options.autoSlideStopWhenClicked) { clearTimeout(self.autoslideTimeout); }
					return false;
				}
				if (self.options.autoSlide) {
					// Clear the timeout
					if (self.options.autoSlideStopWhenClicked) { clearTimeout(self.autoslideTimeout); }
					else {
						self.autoSlide(clearTimeout(self.autoslideTimeout));
						self.clickable = true;
					}
				}
				// Stops from speedy clicking for continuous sliding.
				if (self.options.continuous) {clearTimeout(self.continuousTimeout);}
			});
		},

		setCurrent: function( direction ){
			var self = this;
			if (self.clickable) {
			
				if (typeof direction == 'number') {	self.currentTab = direction;}
				else {
					// "left" = -1; "right" = 1;
					self.currentTab += ( ~~( direction === 'right' ) || -1 );
					// If not continuous, slide back at the last or first panel
					if (!self.options.continuous){
						self.currentTab = (self.currentTab < 0) ? $(self.panelClass).length - 1 : (self.currentTab % $(self.panelClass).length);
					}
				}
				// This is so the height will match the current panel, ignoring the clones.
				// It also adjusts the count for the "currrent" class that's applied
				if (self.options.continuous) {
					self.panelHeightCount = self.currentTab + 1;
					if (self.currentTab === self.panelCount - 2){self.setTab = 0;}
					else if (self.currentTab === -1) {self.setTab = self.panelCount - 3;}
					else {self.setTab = self.currentTab;}
				}
				else{
					self.panelHeightCount = self.currentTab;
					self.setTab = self.currentTab;
				}
				// Add and remove current class.
				if (self.options.dynamicTabs){
					$($(self.sliderId).parent()).find('.tab' + (self.setTab + 1) + ' a:first')
					.addClass('current')
					.parent().siblings().children().removeClass('current');
				}
				// Update the dropdown menu when small.
				if (self.options.responsive) { $(self.sliderId + '-nav-select').val('tab' + (self.currentTab + 1)); }
				this.transition();
			}
		},
		
		transition: function(){
			var self = this;
			// Adjust the height
			if (self.options.autoHeight) {
				$(self.panelContainer).parent().animate({
					'height': $($(self.panelContainer).children()[self.panelHeightCount]).css('height')
				}, {
					easing: self.options.autoHeightEaseFunction,
					duration: self.options.autoHeightEaseDuration,
					queue: false
				});
			}
			// Transition for fade option
			if (self.options.slideEaseFunction === 'fade') {
				$($(self.panelContainer).children()[self.currentTab])
					.fadeTo(self.options.slideEaseDuration, 1.0)
					.siblings().css('display', 'none');
			}
			else {
				// Adjust the margin for continuous sliding
				if (self.options.continuous) {self.marginLeft = -(self.currentTab * self.slideWidth ) - self.slideWidth;}
				// Otherwise adjust as normal
				else {self.marginLeft = -(self.currentTab * self.slideWidth ); }
				// Animate the slider
				(self.panelContainer).animate({
					'margin-left': self.marginLeft + self.pSign
				}, {
					easing: self.options.slideEaseFunction,
					duration: self.options.slideEaseDuration,
					queue: false,
					complete: self.continuousSlide(self.options.slideEaseDuration + 50) // Wonder about this "+50", so far so good...
				});
			}
			if (self.options.responsive){
				// Match the slider margin with the width of the slider (better height transitions)
				$(self.sliderId + '-wrapper').css('width', $(self.sliderId).outerWidth(true));
			}
		},

		autoSlide: function(){
			var self = this;
			// Can't set the autoslide slower than the easing ;-)
			if (self.options.autoSlideInterval < self.options.slideEaseDuration) {
				self.options.autoSlideInterval = (self.options.slideEaseDuration > self.options.autoHeightEaseDuration) ? self.options.slideEaseDuration : self.options.autoHeightEaseDuration;
			}
			if (self.options.continuous) {self.clickable = false;}
			self.autoslideTimeout = setTimeout(function() {
				// Slide left or right
				self.setCurrent( self.options.autoSliderDirection );
				self.autoSlide();

			}, self.options.autoSlideInterval);
		},

		continuousSlide: function (delay){
			var self = this;

			if (self.options.continuous) {
				self.continuousTimeout = setTimeout(function() {

					// If on the last panel (the clone of panel 1), set the margin to the original.
					if (self.currentTab === self.panelCount - 2){
						$(self.panelContainer).css('margin-left', -self.slideWidth + self.pSign);
						self.currentTab = 0;
					}
					// If on the first panel the clone of the last panel), set the margin to the original.
					else if (self.currentTab === -1){
						$(self.panelContainer).css('margin-left', -( ((self.slideWidth * self.panelCount) - (self.slideWidth * 2))) + self.pSign );
						self.currentTab = (self.panelCount - 3);
					}
					self.clickable = true;
				}, delay);
			}
			else{self.clickable = true;}
		}
	};
	
	$.fn.codaSlider = function( options ) {
		return this.each(function() {
			
			var slider = Object.create( Slider );
			slider.init( options, this );

		});
	};
	
	$.fn.codaSlider.options = {
		autoHeight: true,
		autoHeightEaseDuration: 1500,
		autoHeightEaseFunction: "easeInOutExpo",
		autoSlide: true,
		autoSliderDirection: 'right',
		autoSlideInterval: 7000,
		autoSlideStopWhenClicked: true,
		continuous: true,
		dynamicArrows: true,
		dynamicArrowsGraphical: true,
		dynamicArrowLeftText: "&#171; left",
		dynamicArrowRightText: "right &#187;",
		dynamicTabs: true,
		dynamicTabsAlign: "left",
		dynamicTabsPosition: "top",
		firstPanelToLoad: 1,
		panelTitleSelector: "h2.title",
		responsive:true,
		slideEaseDuration: 1500,
		slideEaseFunction: "fade"
	};

})( jQuery, window, document );