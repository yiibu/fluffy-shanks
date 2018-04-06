
// https://developer.mozilla.org/en-US/docs/Web/Events/resize
var optimizedResize = (function() {
  var callbacks = [],
      running = false;
  function resize() {
      if (!running) {
          running = true;
          if (window.requestAnimationFrame) {
              window.requestAnimationFrame(runCallbacks);
          } else {
              setTimeout(runCallbacks, 66);
          }
      }
  }
  function runCallbacks() {
      callbacks.forEach(function(callback) {
          callback();
      });
      running = false;
  }
  function addCallback(callback) {
      if (callback) {
          callbacks.push(callback);
      }
  }
  return {
      add: function(callback) {
          if (!callbacks.length) {
              window.addEventListener('resize', resize);
          }
          addCallback(callback);
      }
  }
}());


// adapted from https://gist.github.com/andrewbranch/6995056
(function($) {
  function AutoShrinker($element) {
      this.$element = $element;
      this.$text = $("p", $element);
      this.initialFontSize = parseFloat($element.css("fontSize"));
      this.currentFontSize = this.initialFontSize;
      this.padding = parseFloat(this.$text.css("padding"));
      this.delta = 2;
      this.resize = function() {
        var maxHeight = this.$element.height() - this.padding,
            newFontSize = this.currentFontSize;

        while ((this.$text[0].scrollHeight - this.padding - this.delta) <= this.$element[0].clientHeight && (this.currentFontSize + this.delta) < this.initialFontSize) {
          newFontSize = newFontSize + this.delta;
          this.$element.css("fontSize", newFontSize);
        }
        while ((this.$text[0].scrollHeight - this.padding - this.delta) > maxHeight) {
          newFontSize = newFontSize - this.delta;
          this.$element.css("fontSize", newFontSize);
        }
        this.currentFontSize = newFontSize;
      };
  }
  $.fn.autoshrink = function() {
      return this.each(function() {
          var shrinker, $this = $(this);
          $this.data("autoshrinker", shrinker = new AutoShrinker($this));
          shrinker.resize();
          optimizedResize.add(function() {
            shrinker.resize();
        });
      });
  };
})(jQuery);

// end of plugins

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

  $(".panel.text").autoshrink();
});
