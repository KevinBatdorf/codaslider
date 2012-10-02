[Coda Slider](http://kevinbatdorf.github.com/codaslider)
============
A jQuery HTML Content Slider Plugin

[Standard Version](https://github.com/KevinBatdorf/codaslider/zipball/master)

[Responsive Version](http://kevinbatdorf.com/blog/2012/07/26/a-responsive-content-slider-preview/) Coming Soon

Features
--------

Continuous Sliding  
Dynamic Tabs & Arrows  
Cross Linking


How to Use
-----------

See [here](http://kevinbatdorf.github.com/codaslider) for further details.

Install the slider in the head after jQuery.

```javascript
    <script src="./js/jquery.coda-slider-3.0.js"></script>  
    $().ready(function(){
        $('#slider-id').codaSlider();
      });
```

Where the slider-id matches the id of the content, as follows:

```html
      <div class="coda-slider"  id="slider-id">
          <div>
            <h2 class="title">Panel 1</h2>
            <p>Content</p>
          </div>
          <div>
            <h2 class="title">Panel 2</h2>
            <p>Content</p>
          </div>
      </div>
```

Add as many panels as you like within the `<div class="coda-slider id="slider-id"></div>`

One Panel:   
```html
    <div>
      <h2 class="title">Panel</h2>
      <p>Content</p>
    </div>
```

Default Settings
----------------
```javascript
                  autoHeight: true,
      autoHeightEaseDuration: 1500,
      autoHeightEaseFunction: "easeInOutExpo",
                   autoSlide: false,
         autoSliderDirection: 'right',
           autoSlideInterval: 7000,
           autoSlideControls: false,
          autoSlideStartText: 'Start',
           autoSlideStopText: 'Stop',
    autoSlideStopWhenClicked: true,
                  continuous: true,
               dynamicArrows: true,
      dynamicArrowsGraphical: false,
        dynamicArrowLeftText: "&#171; left",
       dynamicArrowRightText: "right &#187;",
                 dynamicTabs: true,
            dynamicTabsAlign: "center",
         dynamicTabsPosition: "top",
            firstPanelToLoad: 1,
                 hashLinking: false,
          panelTitleSelector: "h2.title",
           slideEaseDuration: 1500,
           slideEaseFunction: "easeInOutExpo"
```


Version 3.0
-------------

Complete rebuild from the bottom up.  
Added continuous sliding.  
Added graphical arrows.  
Small fixes.  


Documentation
-------------

http://kevinbatdorf.github.com/codaslider

Submit bugs [here](https://github.com/kevinbatdorf/codaslider/issues)

Maintained by [Kevin Batdorf](http://twitter.com/#!/kevinbatdorf)

Released under the GNU General Public License and the MIT License.

### Very Special Thanks to:
Niall Doherty, the original creater of the Coda Slider.

