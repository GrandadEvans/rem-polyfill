/*
 * I'm using the document.stylesheet method instead of pulling in the link attributes
 * as the document method includes any style tags in the document head
 *
 */

function convert_rems() {

	// Make sure that we have stylesheets available and REM are not already supported
	if (document.stylesheets.length === 0 || test_support) {
		return false;
	}

    // Get the base font size
    var base_font_size = getFontSize();

	for (var z = 0; z < document.styleSheets.length; z++) {
        get_and_action_styles(document.styleSheets[z].href, base_font_size);
    }
}

function get_and_action_styles(href, base_font_size) {
    $.get(href, function(styles) {

        // split the string into lines
        var lines = split_lines(styles);

        // Make sure there are lines to test in the stylesheet
        if (lines.length === 0) {
            return false;
        }

        // Iterate through the lines in the stylesheets
        for (a = 0; a < lines.length; a++) {

            // split lines with multiple rules into separate lines.
            var split_two = lines[a].replace(';', ";\n");

            // Now that we have the split rules we again need to split them into lines
            var clean_lines = split_lines(split_two);

            // Now that we definitely have individual lines we can perform the search and replace
            for (x = 0; x < clean_lines.length; x++) {

                var line = clean_lines[x];

                // Check to make sure that the string 'rem' appears after the colon to bypass things such as "counter-increment: inherit;"
                if ((line.indexOf('rem') >= 0)  &&  (line.indexOf('rem') > line.indexOf(':'))) {

                    // get the property
                    var prop = line.split(':');

                    // make sure we have an index of 2
                    if (prop.length === 2) {
                        prop = prop[1];
                        prop = prop.replace(';', '');

                        var val = parseFloat(prop);

                        // Check to make sure we have a float
                        if (!isNaN(val)) {
                            // Now multiply the rem buy the font-size
                            var new_font_size = (val * parseFloat(base_font_size));

                            new_font_size = ' ' + new_font_size + 'px';

                            // replace the property stylesheet wide

                            var str_replace_all = styles;
                            var int_index_of_match = str_replace_all.indexOf( prop );

                            // Loop over the string value replacing out each matching
                            // substring.
                            while (int_index_of_match != -1){
                                // Relace out the current instance.
                                str_replace_all = str_replace_all.replace( prop, new_font_size);

                                // Get the index of any next matching substring.
                                int_index_of_match = str_replace_all.indexOf( prop );
                            }

                            // Write the stylesheet contents with the replaced values back to styles
                            styles = str_replace_all;

                        } // End of if (!isNaN check

                    } // end of if prop === 2

                } // end of if rem is after :

            } //end of for clean lines

        } // end of lines.length

        // Write the stylesheet back to the file
        document.styleSheets[current_index].cssText=styles;
        var new_length = styles.length;

    }); // End of jquery get for the stylesheet
}

function split_lines(lines) {
    return lines.split("\n");
}

function getFontSize() {
    // taken from https://github.com/chuckcarpenter/REM-unit-polyfill/blob/master/js/rem.js
    body = document.getElementsByTagName('body')[0];
    if (body.currentStyle) {
        if ( body.currentStyle.fontSize.indexOf("px") >= 0 ) {
            fontSize = body.currentStyle.fontSize.replace('px', '');
        } else if ( body.currentStyle.fontSize.indexOf("em") >= 0 ) {
            fontSize = body.currentStyle.fontSize.replace('em', '');
        } else if ( body.currentStyle.fontSize.indexOf("pt") >= 0 ) {
            fontSize = body.currentStyle.fontSize.replace('pt', '');
        } else {
            fontSize = (body.currentStyle.fontSize.replace('%', '') / 100) * 16; // IE8 returns the percentage while other browsers return the computed value
        }
    } else if (window.getComputedStyle) {
        fontSize = document.defaultView.getComputedStyle(body, null).getPropertyValue('font-size').replace('px', ''); // find font-size in body element
    }

    return fontSize;
}

function test_support() {
    // This is takesn from the modernizr repo at
    // https://github.com/Modernizr/Modernizr/commit/84dbc9a92d7c5c8dab1e87788f58982dab5f9f75
    // Byhttps://github.com/segdeha

    var elem = document.createElement('p');
    elem.style.cssText = 'font-size: 1.5rem;';
    return elem.style.fontSize.indexOf('rem') > -1;
}

convert_rems();
