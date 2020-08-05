


 Fluffy Shanks Concept Prototype
==========================

Released April 9, 2018
By Bryan Rieger <bryan@yiibu.com>
Available at: [https://fluffy-shanks.glitch.me/](https://fluffy-shanks.glitch.me/)

Github: [https://github.com/bryanrieger/fluffy-shanks](https://github.com/bryanrieger/fluffy-shanks)
Glitch: [https://glitch.com/edit/#!/remix/fluffy-shanks](https://glitch.com/edit/#!/remix/fluffy-shanks)

The code contained in this prototype was never intended for a production release.
This prototype was made to further illustratte the ideas presented in the following
articles: 

1.  [Rethinking the creative web: Our journey to reimagine ‘web publishing’ for the social web](https://medium.com/@stephanierieger/26c2f347fcd0)
2. [Rethinking the creative web: Part 2 — Designing Hopscotch](https://medium.com/p/3ab41f9fbf27/)
3.  [Rethinking the creative web: Part 3 — What might have been](https://medium.com/@stephanierieger/185fe258690b)


Known Issues (and there are MANY):

1.  It's BIG. Fully loaded it's around a 10MB which is insane!
A production version would absolutely require lazy loading of all assets in order to
not overwhelm a user's data plan (or device).
2.  Navigating with the arrow keys doesn't work terribly well. I think it's a known issue
with the SlickJS library we used see:  [Scrollbar jump on previous/next slide click in Chrome #1537](https://github.com/kenwheeler/slick/issues/1537)
3.  Switching between 'grid' and 'stack' modes on desktop is buggy (especially grid to stack).
I think I'm abusing SlickJS a little bit too much here, and I suspect this is it's
way of telling me so.
4.  I didn't bother adding layout watchers to every panel component, so not everything
resizes the way that .links and .text panels do. This means that some text might be
hidden at various resolutions (most noticeable in grid layout).
5.  When you switch to grid layout (icon in the top right corner) the stack has a tendency
to jump around a bit. I have no idea why.
6.  You can't swipe on iframes. Just make sure you don't make an iframe 100% height, and
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
