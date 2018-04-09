/*     

      ___                       ___           ___         ___                        
      /  /\                     /__/\         /  /\       /  /\        ___            
     /  /:/_                    \  \:\       /  /:/_     /  /:/_      /__/|           
    /  /:/ /\  ___     ___       \  \:\     /  /:/ /\   /  /:/ /\    |  |:|           
   /  /:/ /:/ /__/\   /  /\  ___  \  \:\   /  /:/ /:/  /  /:/ /:/    |  |:|           
  /__/:/ /:/  \  \:\ /  /:/ /__/\  \__\:\ /__/:/ /:/  /__/:/ /:/   __|__|:|           
  \  \:\/:/    \  \:\  /:/  \  \:\ /  /:/ \  \:\/:/   \  \:\/:/   /__/::::\           
   \  \::/      \  \:\/:/    \  \:\  /:/   \  \::/     \  \::/       ~\~~\:\          
    \  \:\       \  \::/      \  \:\/:/     \  \:\      \  \:\         \  \:\         
     \  \:\       \__\/        \  \::/       \  \:\      \  \:\         \__\/         
      \__\/                     \__\/         \__\/       \__\/                       
       ___           ___           ___           ___           ___           ___      
      /  /\         /__/\         /  /\         /__/\         /__/|         /  /\     
     /  /:/_        \  \:\       /  /::\        \  \:\       |  |:|        /  /:/_    
    /  /:/ /\        \__\:\     /  /:/\:\        \  \:\      |  |:|       /  /:/ /\   
   /  /:/ /::\   ___ /  /::\   /  /:/~/::\   _____\__\:\   __|  |:|      /  /:/ /::\  
  /__/:/ /:/\:\ /__/\  /:/\:\ /__/:/ /:/\:\ /__/::::::::\ /__/\_|:|____ /__/:/ /:/\:\ 
  \  \:\/:/~/:/ \  \:\/:/__\/ \  \:\/:/__\/ \  \:\~~\~~\/ \  \:\/:::::/ \  \:\/:/~/:/ 
   \  \::/ /:/   \  \::/       \  \::/       \  \:\  ~~~   \  \::/~~~~   \  \::/ /:/  
    \__\/ /:/     \  \:\        \  \:\        \  \:\        \  \:\        \__\/ /:/   
      /__/:/       \  \:\        \  \:\        \  \:\        \  \:\         /__/:/    
      \__\/         \__\/         \__\/         \__\/         \__\/         \__\/     


  Fluffy Shanks Concept Prototype
  Released April 9, 2018
  By Bryan Rieger <bryan@yiibu.com>
  Available at: https://fluffy-shanks.glitch.me/

  Github: https://github.com/bryanrieger/fluffy-shanks
  Glitch: https://glitch.com/edit/#!/remix/fluffy-shanks

  The code contained in this prototype was never intended for a production release.
  This prototype was made to further illustratte the ideas presented in the following
  articles: 
  
    1.  Rethinking the creative web: Our journey to reimagine ‘web publishing’ for the social web
        https://medium.com/@stephanierieger/26c2f347fcd0

     2. Rethinking the creative web: Part 2 — Designing Hopscotch
        https://medium.com/p/3ab41f9fbf27/

    3.  Rethinking the creative web: Part 3 — What might have been
        https://medium.com/@stephanierieger/185fe258690b

  Known Issues (and there are MANY):

    1.  It's BIG. Fully loaded it's around a 10MB which is insane!
        A production version would absolutely require lazy loading of all assets in order to
        not overwhelm a user's data plan (or device).
    2.  Navigating with the arrow keys doesn't work terribly well. I think it's a known issue
        with the SlickJS library we used https://github.com/kenwheeler/slick/issues/1537
    3.  Switching between 'grid' and 'stack' modes on desktop is buggy (especially grid to stack).
        I think I'm abusing SlickJS a little bit too much here, and I suspect this is it's
        way of telling me so.
    4.  I didn't bother adding layout watchers to every panel component, so not everything
        resizes the way that .links and .text panels do. This means that some text might be
        hidden at various resolutions (most noticeable in grid layout).
    5.  When you switch to grid layout (icon in the top right corner) the stack has a tendency
        to jump around a bit. I have no idea why.
    6.  You can't swipe on <iframes>. Just make sure you don't make an iframe 100% height, and
        just swipe on another non-iframe area of the card.
    7.  The code has been optimized for my convenience, and does not make any attempt to
        adhere to any best (or even good) practices. You're probably best looking it solely
        as a really odd learning experience in what not to do. :)
    8.  …
        

    If you find any additional issues feel free to file them on Github, but please don't
    expect that I'm going to fix them anytime in the near future. :)
    https://github.com/bryanrieger/fluffy-shanks/issues

    If you have any questions, please feel free to ping me on Twitter (@bryanrieger),
    or leave a comment on any of the Medium articles (above).

    Cheers,

    Bryan Rieger
    April 9, 2018
    Vancouver, Canada

*/

/*

  In an effort to not crash the browser I'm using an optimisedResize function
  that I found in Mozilla's MDN docs (see link below) to manage the text and
  layout functions that are triggered on resize.
  https://developer.mozilla.org/en-US/docs/Web/Events/resize

*/

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

/*

  Text and Layout Watchers adapted from AutoShrink by Andrew Branch
  Responds to window resize events and updates the panels accordingly
  https://gist.github.com/andrewbranch/6995056

*/

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
      {"type": "link", "breakpoints": {"tiny": {"min": 0, "max": 90}, "compact": {"min": 90, "max": 150}, "extended": {"min": 250, "max": 99999}}},
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
          this.$element.removeClass(this.$layoutClass);
        }
        this.$element.addClass(breakpointName);
        this.$layoutClass = breakpointName;
      } 
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

/*

  Text and Layout Watchers adapted from AutoShrink by Andrew Branch
  Responds to window resize events and updates the panels accordingly
  https://gist.github.com/andrewbranch/6995056

*/

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
      $(".stack").append('<div class="progress"><span></span></div>');
  });

  $(".stack").slick({
    arrows: false,
    infinite: false,
    waitForAnimate: true
  });

  if(window.location.hash) {
    var hash = window.location.hash.substring(1);
    var id = $("#" + hash);
    var card = $('.stack .card').index(id);
    $(".stack").slick('slickGoTo', card, true);
  }

  $("body").append('<nav class="controls"><span><strong>Fluffy Shanks</strong> - <em>concept prototype</em></span><button id="toggle">grid</button></nav>');
  $("#toggle").click(function() {
    if ($("body").hasClass("grid-layout")) {
      $("#toggle").text("grid");
      $(".stack").slick({
        arrows: false,
        infinite: false,
        waitForAnimate: true
      });
      $(".stack").slick("slickGoTo", 0, false);
    } else {
      $(".progress").remove();
      $('.stack').slick('unslick');
      $("#toggle").text("stack");
      
      var video = $(".stack").find("video");
      if (video.length) {
        video.each(function (i, obj) {
          obj.play();
        });
        playingVideo = video;
      }
      iframe = $(".stack").find("iframe");
      if (iframe.length) {
        iframe.each(function (i, obj) {
          if ($(obj).attr("src") == undefined) {
            $(obj).attr("src", $(obj).attr("data-src"));
          }
        });
      }
    }
    $("body").toggleClass("grid-layout");
  });

  /*
    I've only set-up watchers for for text, link and cover panels.
    Expect image, video, clip, embed, etc panels to have some funky layouts.
  */
  $(".panel.text").textwatcher();
  $('.panel.link').layoutwatcher();
  $('.panel.cover').layoutwatcher();

  // these methods are *really* buggy, and are only used here for convenience…
  $(document).keydown(function(event) {
    switch (event.keyCode) {
        case 37: $(".stack").slick('slickPrev'); break;
        case 38: $(".stack").slick('slickPrev'); break;
        case 39: $(".stack").slick('slickNext'); break;
        case 40: $(".stack").slick('slickNext'); break;
    }
  });
});
