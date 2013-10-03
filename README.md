#REM Polyfill for IE8

This polyfill does the following
1. Scans for stylesheets both via <link> and <style> tags
2. Gets the base font size
3. Replaces all instances of rem units to the px equivalent. (currently only px though)

I did try the rem-unit polyfill but I also needed media query support.
So along with the media queries polyfill you can now have both in IE8
* REM unit support
* Media queru support

## Help
Ok, here's the deal. I know that my Javascript coding techniques could do with improving.
The script works fine as it is (as long as your html tag has a px font-size assigned to it)
but I want to know how I can improve my coding style. How can I make the script more efficient?

##ToDo
1 Get the base_font-size unit passed back as well so that the multiplication returns the
correct unit back
