// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html

// https://gist.github.com/mekwall/1263939

$(function() {

  var playingVideo;

  $(".stack").on("beforeChange", function(event, slick, currentSlide, nextSlide) {

    var id = $(slick.$slides.get(nextSlide)).attr('id'),
    iframe = $("#" + id).find("iframe");
    window.location.hash = id;

    if (iframe.length) {
      iframe.each(function (i, obj) {
        if ($(obj).attr("src") == undefined) {
          $(obj).attr("src", $(obj).attr("data-src"));
        }
      });
    }

  });

  $(".stack").on("afterChange", function(event, slick, currentSlide) {

    var id = $(slick.$slides.get(currentSlide)).attr('id'),
        video = $("#" + id).find("video");

    if (playingVideo) {
      playingVideo.each(function (i, obj) {
        obj.pause();
      });
    }

    if (video.length) {
      video.each(function (i, obj) {
        obj.play();
      });
      playingVideo = video;
    }
  });

  $(".stack").on("init", function(event, slick) {
    
  });

  $(".stack").slick({
    arrows: false,
    infinite: false,
    waitForAnimate: false
  });

  if(window.location.hash) {
    var hash = window.location.hash.substring(1); //Puts hash in variable, and removes the # character
    var id = $("#" + hash);
    var card = $('.stack .card').index(id);
    $(".stack").slick('slickGoTo', card, true);
  }

});
