"use strict";
(function () {
	// Global variables
	var userAgent = navigator.userAgent.toLowerCase(),
		initialDate = new Date(),

		$window = $(window),
		$html = $("html"),
		$body = $("body"),
		isDesktop = $html.hasClass("desktop"),
		isIos = $html.hasClass("ios"),
		isMac = navigator.platform.match(/(Mac)/i),
		isIE = userAgent.indexOf("msie") !== -1 ? parseInt(userAgent.split("msie")[1], 10) : userAgent.indexOf("trident") !== -1 ? 11 : userAgent.indexOf("edge") !== -1 ? 12 : false,
		windowReady = false,
		isNoviBuilder = false,
		plugins = {
			rdNavbar: $(".rd-navbar"),
			wow: $(".wow"),
			isotope: $(".isotope-wrap"),
			counter: $(".counter"),
			copyrightYear: $(".copyright-year"),
			buttonWinona: $('.button-winona')
		};

	/**
	 * @desc Check the element whas been scrolled into the view
	 * @param {object} elem - jQuery object
	 * @return {boolean}
	 */
	function isScrolledIntoView(elem) {
		if (!isNoviBuilder) {
			return elem.offset().top + elem.outerHeight() >= $window.scrollTop() && elem.offset().top <= $window.scrollTop() + $window.height();
		}
		else {
			return true;
		}
	}

	// Initialize scripts that require a loaded page
	$window.on('load', function () {
		windowReady = true;

		// jQuery Count To
		if (plugins.counter.length) {
			for (var i = 0; i < plugins.counter.length; i++) {
				var
					counter = $(plugins.counter[i]),
					initCount = function () {
						var counter = $(this);
						if (!counter.hasClass("animated-first") && isScrolledIntoView(counter)) {
							counter.countTo({
								refreshInterval: 40,
								speed: counter.attr("data-speed") || 1000,
								from: 0,
								to: parseInt(counter.text(), 10)
							});
							counter.addClass('animated-first');
						}
					};

				$.proxy(initCount, counter)();
				$window.on("scroll", $.proxy(initCount, counter));
			}
		}


		// Isotope
		if ( plugins.isotope.length ) {
			for ( var i = 0; i < plugins.isotope.length; i++ ) {
				var
					wrap = plugins.isotope[ i ],
					filterHandler = function ( event ) {
						event.preventDefault();
						for ( var n = 0; n < this.isoGroup.filters.length; n++ ) this.isoGroup.filters[ n ].classList.remove( 'active' );
						this.classList.add( 'active' );
						this.isoGroup.isotope.arrange( { filter: this.getAttribute( "data-isotope-filter" ) !== '*' ? '[data-filter*="' + this.getAttribute( "data-isotope-filter" ) + '"]' : '*' } );
					},
					resizeHandler = function () {
						this.isoGroup.isotope.layout();
					};

				wrap.isoGroup = {};
				wrap.isoGroup.filters = wrap.querySelectorAll( '[data-isotope-filter]' );
				wrap.isoGroup.node = wrap.querySelector( '.isotope' );
				wrap.isoGroup.layout = wrap.isoGroup.node.getAttribute( 'data-isotope-layout' ) ? wrap.isoGroup.node.getAttribute( 'data-isotope-layout' ) : 'masonry';
				wrap.isoGroup.isotope = new Isotope( wrap.isoGroup.node, {
					itemSelector: '.isotope-item',
					layoutMode: wrap.isoGroup.layout,
					filter: '*',
					columnWidth: ( function() {
						if ( wrap.isoGroup.node.hasAttribute('data-column-class') ) return wrap.isoGroup.node.getAttribute('data-column-class');
						if ( wrap.isoGroup.node.hasAttribute('data-column-width') ) return parseFloat( wrap.isoGroup.node.getAttribute('data-column-width') );
					}() )
				} );

				for ( var n = 0; n < wrap.isoGroup.filters.length; n++ ) {
					var filter = wrap.isoGroup.filters[ n ];
					filter.isoGroup = wrap.isoGroup;
					filter.addEventListener( 'click', filterHandler );
				}

				window.addEventListener( 'resize', resizeHandler.bind( wrap ) );
			}
		}

		// Trigger initial video filter after Isotope is ready
		var videoBtn = document.querySelector('[data-isotope-filter="video"]'),
			fotoGrid = document.querySelector('.foto-grid');
		if (videoBtn && !videoBtn.classList.contains('clicked')) {
			videoBtn.classList.add('clicked');
			videoBtn.click();
			if (fotoGrid) fotoGrid.classList.remove('active');
		}
	});

	// Initialize scripts that require a finished document
	$(function () {


		// Additional class on html if mac os.
		if (isMac) {
			$html.addClass("mac-os");
		}




		// Copyright Year (Evaluates correct copyright year)
		if (plugins.copyrightYear.length) {
			plugins.copyrightYear.text(initialDate.getFullYear());
		}

		// UI To Top
		if (isDesktop && !isNoviBuilder) {
			$().UItoTop({
				easingType: 'easeOutQuad',
				containerClass: 'ui-to-top'
			});
		}

		// RD Navbar
		if (plugins.rdNavbar.length) {
			var aliaces, i, j, len, value, values, responsiveNavbar;

			aliaces = ["-", "-sm-", "-md-", "-lg-", "-xl-", "-xxl-"];
			values = [0, 576, 768, 992, 1200, 1600];
			responsiveNavbar = {};

			for (var z = 0; z < plugins.rdNavbar.length; z++) {
				var $rdNavbar = $(plugins.rdNavbar[z]);

				for (i = j = 0, len = values.length; j < len; i = ++j) {
					value = values[i];
					if (!responsiveNavbar[values[i]]) {
						responsiveNavbar[values[i]] = {};
					}
					if ($rdNavbar.attr('data' + aliaces[i] + 'layout')) {
						responsiveNavbar[values[i]].layout = $rdNavbar.attr('data' + aliaces[i] + 'layout');
					}
					if ($rdNavbar.attr('data' + aliaces[i] + 'device-layout')) {
						responsiveNavbar[values[i]]['deviceLayout'] = $rdNavbar.attr('data' + aliaces[i] + 'device-layout');
					}
					if ($rdNavbar.attr('data' + aliaces[i] + 'hover-on')) {
						responsiveNavbar[values[i]]['focusOnHover'] = $rdNavbar.attr('data' + aliaces[i] + 'hover-on') === 'true';
					}
					if ($rdNavbar.attr('data' + aliaces[i] + 'auto-height')) {
						responsiveNavbar[values[i]]['autoHeight'] = $rdNavbar.attr('data' + aliaces[i] + 'auto-height') === 'true';
					}

					if (isNoviBuilder) {
						responsiveNavbar[values[i]]['stickUp'] = false;
					} else if ($rdNavbar.attr('data' + aliaces[i] + 'stick-up')) {
						var isDemoNavbar = $rdNavbar.parents('.layout-navbar-demo').length;
						responsiveNavbar[values[i]]['stickUp'] = $rdNavbar.attr('data' + aliaces[i] + 'stick-up') === 'true' && !isDemoNavbar;
					}

					if ($rdNavbar.attr('data' + aliaces[i] + 'stick-up-offset')) {
						responsiveNavbar[values[i]]['stickUpOffset'] = $rdNavbar.attr('data' + aliaces[i] + 'stick-up-offset');
					}
				}

				$rdNavbar.RDNavbar({
					anchorNav: !isNoviBuilder,
					stickUpClone: ($rdNavbar.attr("data-stick-up-clone") && !isNoviBuilder) ? $rdNavbar.attr("data-stick-up-clone") === 'true' : false,
					responsive: responsiveNavbar,
					callbacks: {
						onStuck: function () {
							var navbarSearch = this.$element.find('.rd-search input');

							if (navbarSearch) {
								navbarSearch.val('').trigger('propertychange');
							}
						},
						onDropdownOver: function () {
							return !isNoviBuilder;
						},
						onUnstuck: function () {
							if (this.$clone === null)
								return;

							var navbarSearch = this.$clone.find('.rd-search input');

							if (navbarSearch) {
								navbarSearch.val('').trigger('propertychange');
								navbarSearch.trigger('blur');
							}

						}
					}
				});


				if ($rdNavbar.attr("data-body-class")) {
					document.body.className += ' ' + $rdNavbar.attr("data-body-class");
				}

			}
		}



		// WOW — animaciones al hacer scroll
		try {
			if (plugins.wow.length) {
				new WOW({ mobile: true, live: false }).init();
			}
		} catch(e) {}








		// Winona buttons
		if (plugins.buttonWinona.length && !isNoviBuilder && !isIos && !isMac) {
			initWinonaButtons(plugins.buttonWinona);
		}

		function initWinonaButtons(buttons) {
			for (var i = 0; i < buttons.length; i++) {
				var $button = $(buttons[i]),
					innerContent = $button.html();

				$button.html('');
				$button.append('<div class="content-original">' + innerContent + '</div>');
				$button.append('<div class="content-dubbed">' + innerContent + '</div>');
			}
		}




	});



	// Photo/Video modal & filters
	document.addEventListener('DOMContentLoaded', function () {
		var modal = document.getElementById('photoModal');
		if (!modal) return;

		var videoBtn = document.querySelector('[data-isotope-filter="video"]'),
			fotoBtn = document.querySelector('[data-isotope-filter="fotografia"]'),
			fotoGrid = document.querySelector('.foto-grid');
		if (videoBtn) videoBtn.addEventListener('click', function () { if (fotoGrid) fotoGrid.classList.remove('active'); });
		if (fotoBtn) fotoBtn.addEventListener('click', function () { if (fotoGrid) fotoGrid.classList.add('active'); });
		var allItems = [], mediaItems = [], mediaIdx = 0;
		document.querySelectorAll('[data-photo],[data-video]').forEach(function (el) {
			allItems.push({
				el: el,
				type: el.hasAttribute('data-photo') ? 'photo' : 'video',
				img: el.getAttribute('data-img'),
				vimeo: el.getAttribute('data-vimeo'),
				desc: el.getAttribute('data-desc'),
				behance: el.getAttribute('data-behance'),
				title: el.closest('article').querySelector('img').alt
			});
			el.addEventListener('click', function (e) {
				e.preventDefault();
				var t = el.hasAttribute('data-photo') ? 'photo' : 'video';
				mediaItems = allItems.filter(function (m) { return m.type === t; });
				mediaIdx = mediaItems.findIndex(function (m) { return m.el === el; });
				openModal();
			});
		});
		function openModal() {
			var m = mediaItems[mediaIdx],
				img = document.getElementById('modalImg'),
				video = document.getElementById('modalVideo'),
				desc = document.getElementById('modalDesc'),
				btn = document.getElementById('modalBtn'),
				title = document.getElementById('modalTitle');
			desc.textContent = m.desc;
			title.textContent = m.title;
			if (m.type === 'photo') {
				img.src = m.img;
				img.style.display = 'block';
				video.style.display = 'none';
				btn.href = m.behance;
				btn.style.display = '';
			} else {
				img.style.display = 'none';
				video.style.display = 'block';
				video.innerHTML = '<iframe src="https://player.vimeo.com/video/' + m.vimeo + '?autoplay=1" frameborder="0" allow="autoplay;fullscreen" allowfullscreen></iframe>';
				btn.style.display = 'none';
			}
			modal.classList.add('active');
		}
		function closeModal() {
			modal.classList.remove('active');
			var mv = document.getElementById('modalVideo');
			if (mv) mv.innerHTML = '';
		}
		var prevBtn = document.getElementById('modalPrev'),
			nextBtn = document.getElementById('modalNext'),
			closeBtn = document.querySelector('.photo-modal-close');
		if (prevBtn) prevBtn.addEventListener('click', function () {
			mediaIdx = (mediaIdx - 1 + mediaItems.length) % mediaItems.length;
			openModal();
		});
		if (nextBtn) nextBtn.addEventListener('click', function () {
			mediaIdx = (mediaIdx + 1) % mediaItems.length;
			openModal();
		});
		modal.addEventListener('click', function (e) {
			if (e.target === this || e.target.classList.contains('photo-modal-overlay')) closeModal();
		});
		if (closeBtn) closeBtn.addEventListener('click', closeModal);
		document.addEventListener('keydown', function (e) {
			if (e.key === 'Escape') { closeModal(); }
			else if (e.key === 'ArrowLeft' && mediaItems.length) { mediaIdx = (mediaIdx - 1 + mediaItems.length) % mediaItems.length; openModal(); }
			else if (e.key === 'ArrowRight' && mediaItems.length) { mediaIdx = (mediaIdx + 1) % mediaItems.length; openModal(); }
		});
	});

	// ponytail: hides navbar on scroll down, shows on scroll up
	var lastScroll = 0;
	window.addEventListener('scroll', function () {
		var nav = document.querySelector('.rd-navbar--is-stuck') || document.querySelector('.rd-navbar-fixed .rd-navbar-panel');
		if (!nav) return;
		var st = window.pageYOffset || document.documentElement.scrollTop;
		if (st > lastScroll && st > 80) nav.classList.add('rd-navbar--hidden');
		else nav.classList.remove('rd-navbar--hidden');
		lastScroll = st;
	}, { passive: true });
}());
