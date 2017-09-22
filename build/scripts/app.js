/*global $ webshim*/

var app = {

	init: function () {

		(function () {
			webshim.setOptions('forms', {
				lazyCustomMessages: true,
				replaceValidationUI: true
			});
			webshim.polyfill('forms');
		})();

		document.addEventListener("DOMContentLoaded", function () {
			app.bindActions();
		});
	},

	bindActions: function () {
		var content = document.querySelector(".content");

		// form phone input handler
		$("input[name=phone]").inputmask({
			"mask": "+9(999)999-9999",
			clearIncomplete: true
		});

		// autoplay video
		(function () {
			var video = document.querySelector("#video");

			if (video) {
				video.play();
			}
		})();

		(function () {
			var links = document.querySelectorAll(".js-scroll-link");

			for (var i = 0; i < links.length; i++) {
				var link = links[i];

				link.addEventListener("click", function (e) {
					e.preventDefault();
					var el = this.getAttribute("href");

					$("html, body").animate({
						scrollTop: $(el).offset().top
					}, 400);
				});
			}
		})();

		// form handler
		(function () {
			var forms = document.querySelectorAll(".gallery__form");

			for (var i = 0; i < forms.length; i++) {
				var form = forms[i];

				form.addEventListener("submit", function (e) {
					e.preventDefault();

					var self = this;
					var formData = $(self).serialize();

					$.ajax({
						type: "POST",
						url: "mail/send.php",
						data: formData,
						success: function () {
							alert("Заявка отправлена");
							clearForm(self);
						},
						error: function () {
							alert("Ошибка");
						}
					});
				});
			}

			function clearForm(form) {
				var inputsArr = form.querySelectorAll("input");

				for (var i = 0; i < inputsArr.length; i++) {
					var input = inputsArr[i];
					input.value = "";
				}
			}
		})();

		// confirm age
		(function () {
			var ageConfirmBtn = document.querySelector(".js-check-age-confirm");
			//localStorage.removeItem("checkAge")

			if (content.classList.contains("content_index")) {

				if (localStorage.getItem("checkAge") !== null) {
					content.classList.remove("content_hide");
					app.createGallery();
				} else {
					content.querySelector(".content__check-age").style.display = "block";
				}

				ageConfirmBtn.addEventListener("click", function (e) {
					e.preventDefault();

					localStorage.setItem("checkAge", true);
					fade();

					function fade() {
						var contentCheckAge = content.querySelector(".content__check-age");
						contentCheckAge.classList.add("content__check-age_fade");

						contentCheckAge.addEventListener("transitionend", function () {
							var self = this;

							self.style.display = "none";
							content.classList.remove("content_hide");

							setTimeout(app.createGallery, 300);
						});
					}
				});
			}
		})();

		(function createNewsPage() {

			if (document.querySelector(".content__news")) {
				app.createNews(2);
			} else {
				app.createNews();
			}
		})();
	},

	// switch between forms
	createGallery: function () {
		var gallery = document.querySelector(".js-gallery");

		if (gallery) {
			var galleryLeft = document.querySelector(".js-gallery-nav-left");
			var galleryRight = document.querySelector(".js-gallery-nav-right");
			var galleryCenter = document.querySelectorAll(".js-arrow-goto-center");
			var gallerySlider;

			$(gallery).not('.slick-initialized').on('init', function (event, slick) {
				gallery.classList.add("gallery__container_init");
			});

			gallerySlider = $(gallery).not('.slick-initialized').slick({
				infinite: false,
				adaptiveHeight: true,
				arrows: false,
				initialSlide: 1,
				draggable: false,
				swipe: false
			});

			if (window.matchMedia("(max-width:768px)").matches) {
				gallerySlider.on('afterChange', function (event, slick, currentSlide) {

					$("html, body").animate({
						scrollTop: $("#gallery").offset().top
					}, 300);
				});
			}

			galleryLeft.addEventListener("click", function () {
				gallerySlider.slick("slickGoTo", 0);
			});

			galleryRight.addEventListener("click", function () {
				gallerySlider.slick("slickGoTo", 2);
			});

			for (var i = 0; i < galleryCenter.length; i++) {
				galleryCenter[i].addEventListener("click", function () {
					gallerySlider.slick("slickGoTo", 1);
				});
			}
		}
	},

	createNews: function (index) {

		$.ajax({
			type: "GET",
			url: "json/news.json",
			success: function (data) {
				createPosts(data, index);
			},
			error: function () {
				console.log("error");
			}
		});

		function createPosts(dataResponse, items) {
			var DOMEl;
			var data = JSON.parse(dataResponse);

			for (var key in data) {
				var posts = "";
				DOMEl = document.querySelector(".js-" + key);

				if (DOMEl) {

					for (var j = 0; j < (items || data[key].length); j++) {

						if (data[key][j]) {
							var item = data[key][j];
							var post = "<div class='post'>";
							var postImg = "<div class='post__img' style='background-image:url(" + item.img + ")'></div>";
							var postInfo = "<div class='post__info'>";
							var postTitle = "<div class='post__title'><p>" + item.title + "</p></div>";
							var postText = "<div class='post__text'>" + item.text + "</div>";
							postInfo += postTitle + postText + "</div>";

							post += postImg + postInfo + "</div>";
							posts += post;
						}
					}

					DOMEl.innerHTML = posts;
				}
			}
		}
	}
};

app.init();
//# sourceMappingURL=app.js.map
