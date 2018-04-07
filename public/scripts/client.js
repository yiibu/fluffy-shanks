
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
  function TextWatcher($element) {
      this.$element = $element;
      this.$text = $("p", $element);
      this.initialFontSize = parseFloat($element.css("fontSize"));
      this.currentFontSize = this.initialFontSize;
      this.padding = parseFloat(this.$text.css("padding"));
      this.delta = 2;
      this.update = function() {
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
  function LayoutWatcher($element) {
    this.$element = $element;
    this.$layouts = [
      {"type": "link", "breakpoints": {"compact": {"min": 0, "max": 150}, "default": {"min": 150, "max": 250}, "extended": {"min": 250, "max": 99999}}},
      {"type": "clip", "breakpoints": {"tiny": {"min": 0, "max": 80}, "std": {"min": 80, "max": 150}, "full": {"min": 150, "max": 99999}}},
      {"type": "cover", "breakpoints": {"compact": {"min": 0, "max": 320}, "full": {"min": 320, "max": 99999}}},
      {"type": "colophon", "breakpoints": {"tiny": {"min": 0, "max": 80}, "std": {"min": 80, "max": 150}, "full": {"min": 150, "max": 99999}}},
      {"type": "none", "breakpoints": {}}
    ];
    var $this = this, layout = this.$layouts.forEach(function(layout) {
      if ($($this.$element).hasClass(layout.type)) {
        $this.$layout = layout;
      }
    });
    this.$padding = parseFloat(this.$element.css("padding"));
    this.update = function() {

      var breakpointName,
          height = this.$element.height() - this.$padding;
      $.each(this.$layout.breakpoints, function(name, range) {
        if (height >= range.min && height < range.max ) {
          breakpointName = name;
        }
      });

      if (this.$layoutClass !== breakpointName) {
        if (this.$layoutClass !== undefined) {
          console.log("remove: " + this.$layoutClass + " for " + breakpointName);
          this.$element.removeClass(this.$layoutClass);
        }
        console.log("set: " + breakpointName);
        this.$element.addClass(breakpointName);
        this.$layoutClass = breakpointName;
      } 
      console.log("layoutClass: " + this.$layoutClass);
    };
  }
  $.fn.textwatcher = function() {
      return this.each(function() {
          var watcher, $this = $(this);
          $this.data("textwatcher", watcher = new TextWatcher($this));
          watcher.update();
          optimizedResize.add(function() {
            watcher.update();
        });
      });
  };
  $.fn.layoutwatcher = function(options) {
    return this.each(function() {
      var watcher, $this = $(this);
      $this.data("layoutwacher", watcher = new LayoutWatcher($this));
      watcher.update();
      optimizedResize.add(function() {
        watcher.update();
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

    var progress = Math.round(((nextSlide + 1)/slick.slideCount) * 100);
    console.log(progress + " " + slick.slideCount + " " + nextSlide);
    $(".progress span").css("width", progress + "%");

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
    $( ".stack" ).append('<div class="progress"><span></span></div>');
  });

  $(".stack").slick({
    arrows: false,
    infinite: false,
    waitForAnimate: true
  });

  if(window.location.hash) {
    var hash = window.location.hash.substring(1); //Puts hash in variable, and removes the # character
    var id = $("#" + hash);
    var card = $('.stack .card').index(id);
    $(".stack").slick('slickGoTo', card, true);
  }

  $(".panel.text").textwatcher();
  $('.panel.link').layoutwatcher();
  $('.panel.cover').layoutwatcher();

  // these methods are *really* buggy, but they're here for convenience…
  $(document).keydown(function(event) {
    switch (event.keyCode) {
        case 37: $(".stack").slick('slickPrev'); break;
        case 38: $(".stack").slick('slickPrev'); break;
        case 39: $(".stack").slick('slickNext'); break;
        case 40: $(".stack").slick('slickNext'); break;
    }
});
});
