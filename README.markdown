Coda Slider
============
A jQuery HTML Content Slider

[Download Here](https://github.com/KevinBatdorf/codaslider/zipball/master)

You can install with bower
`bower install jquery-codaslider`

How to Use
-----------

Install the slider in the footer.

```javascript
  <script src="./js/jquery.easing.1.3.js"></script>
  <script src="./js/jquery.coda-slider-3.0.js"></script>
  <script>$('#slider-id').codaSlider();</script>
```

Where the slider-id matches the id of the content, as follows:

```html
      <div class="coda-slider"  id="slider-id">
          <div>
            <h2 class="title">Slide 1</h2>
            <p>Content</p>
          </div>
          <div>
            <h2 class="title">Slide 2</h2>
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
          panelTitleSelector: "h2.title",
           slideEaseDuration: 1500,
           slideEaseFunction: "easeInOutExpo"
```

Cross Links
-------------

In order to control the slider from anywhere on the page, use the following code:
(Note that this would control 2 sliders)

```html
<a href="#1" data-ref="slider-id another-slider">Tab 1</a>
```

Auto Slide Controls
-------------

Use one or the other depending on whether autoSlide is enabled.

```html
<a href="#" name="start" data-ref="slider-id" >Start</a>
<a href="#" name="stop"  data-ref="slider-id" >Stop</a>
```

Support
-------------

Submit bugs [here](https://github.com/kevinbatdorf/codaslider/issues)

Maintained by [Kevin Batdorf](https://twitter.com/kevinbatdorf)

Released under the GNU General Public License and the MIT License.
