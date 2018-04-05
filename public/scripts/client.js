// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html

// https://gist.github.com/mekwall/1263939

(function($) {
  $.fn.textFit = function(defaultSize) {
    return this.each(function() {
      var card = $(this).parent()[0],
          panel = this,
          text = $("p", this)[0],
          maxFontSize = parseInt($(panel).attr("data-font-size") || defaultSize),
          currentFontSize = parseInt(window.getComputedStyle(panel).getPropertyValue("font-size")),
          padding = parseInt(window.getComputedStyle(text).padding),
          fontSize = currentFontSize;
      while (text.clientHeight <= panel.clientHeight && fontSize < maxFontSize) {
        fontSize = fontSize + 2;
        panel.style.fontSize = fontSize + "px";
      }
      while (text.scrollHeight - padding > panel.clientHeight - padding) {
        fontSize = fontSize - 2;
        panel.style.fontSize = fontSize + "px";
      }
    });
  };
})(jQuery);

$(function() {
  var throttle = function(type, name, obj) {
    obj = obj || window;
    var running = false;
    var func = function() {
      if (running) {
        return;
      }
      running = true;
      requestAnimationFrame(function() {
        obj.dispatchEvent(new CustomEvent(name));
        running = false;
      });
    };
    obj.addEventListener(type, func);
  };
  throttle("resize", "optimizedResize");

  function updateText(event) {
    $(".panel.text").textFit("15px");
  }

  function updateArrows(event, slick) {
    if (slick.currentSlide <= 0) {
      $(".slick-prev").addClass("dim");
    } else {
      $(".slick-prev").removeClass("dim");
    }
    if (slick.currentSlide >= slick.slideCount - 1) {
      $(".slick-next").addClass("dim");
    } else {
      $(".slick-next").removeClass("dim");
    }
  }

  var playingVideo, playingiFrame;
  var textPanels = $(".panel.text");
  textPanels.each(function (i, obj) {
    if (obj.style.fontSize) {
      $(obj).attr('data-font-size', obj.style.fontSize);
    }
  });

  window.addEventListener("optimizedResize", function() {
    updateText();
  });

  $(".stack").on("beforeChange", function(event, slick, currentSlide, nextSlide) {

    var id = $(slick.$slides.get(nextSlide)).attr('id'),
    iframe = $("#" + id).find("iframe");

    if (playingiFrame) {
      playingiFrame.each(function (i,obj) {
          // $(obj).attr("src", null);
      })
    }

    if (iframe.length) {
      iframe.each(function (i, obj) {
        if ($(obj).attr("src") == undefined) {
          $(obj).attr("src", $(obj).attr("data-src"));
        }
      });
      playingiFrame = iframe;
    }

  });

  $(".stack").on("afterChange", function(event, slick, currentSlide) {
    updateArrows(event, slick);
    window.location.hash = id;
    
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
    updateArrows(event, slick);
    updateText();
  });

  $(".stack").slick({
    dots: true,
    arrows: true,
    infinite: false,
    waitForAnimate: false,
    appendDots: $("main"),
    appendArrows: $("main")
  });

  if(window.location.hash) {
    var hash = window.location.hash.substring(1); //Puts hash in variable, and removes the # character
    var id = $("#" + hash);
    var card = $('.stack .card').index(id);
    $(".stack").slick('slickGoTo', card, true);
  }
});
