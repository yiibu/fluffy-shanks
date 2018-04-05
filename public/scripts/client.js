// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html

// https://gist.github.com/mekwall/1263939

(function($) {
  $.fn.textFit = function() {
    return this.each(function() {
      var card = $(this).parent()[0],
        panel = this,
        text = $("p", this)[0],
        maxFontSize = parseInt($(panel).attr("data-font-size") || "14px");
      fontSize = parseInt(
        window.getComputedStyle(panel).getPropertyValue("font-size")
      );
      padding = parseInt(window.getComputedStyle(text).padding);

      console.log(
        "text: " + text.clientHeight + " scroll: " + text.scrollHeight + " panel: " + panel.clientHeight
      );

      size = fontSize;
      while (text.clientHeight <= panel.clientHeight && size < maxFontSize) {
        console.log(
          "text: " + text.clientHeight + " panel: " + panel.clientHeight + " size: " + size + " max: " + maxFontSize
        );
        size = size + 2;
        panel.style.fontSize = size + "px";
      }
      while (text.scrollHeight > panel.clientHeight) {
        size = size - 2;
        panel.style.fontSize = size + "px";
      }
      console.log(
        "text: " + text.clientHeight + " scroll: " + text.scrollHeight + " panel: " + panel.clientHeight
      );
      console.log(" size: " + size + " max: " + maxFontSize);
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
    $(".panel.text").textFit();
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

  $(".stack").on("init", function(event, slick) {
    updateArrows(event, slick);
  });

  $(".stack").on("afterChange", function(event, slick, currentSlide, nextSlide) {
    updateArrows(event, slick);
    console.log($(slick.$slides.get(currentSlide)).attr('id')); 
  });

  $(".stack").slick({
    arrows: true,
    infinite: false,
    appendArrows: $("main")
  });

  $('video').each(function(i, obj) {
    obj.play();
  });

  window.addEventListener("optimizedResize", function() {
    updateText();
  });

  updateText();
});
