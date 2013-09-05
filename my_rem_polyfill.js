(function (window) {
	
	// Get the base font-size
	var x, z;
	var base_font_size = getFontSize();
	var array_to_push = [];
	
	log('Font size is: ' + base_font_size);
	
	// go through all of the stylesheets
	var styles_arr = document.styleSheets;
	
	for (z=0; z<document.styleSheets.length; z++) {
		// We only want the combines version from Lemonstand
		if (document.styleSheets[z].href.indexOf('ls_css_combine') >= 0) {
			
			var href = document.styleSheets[z].href;
			
			var currentIndex = z;
			var currentHref = href;
			
			$.get(href, function(styles) {
				
				var currentHref = href;
				var old_length = styles.length;

				// split the string into lines
				var lines = split_lines(styles);
				
				log('There are ' + lines.length + ' lines in stylesheet ' + z);
			
				// Iterate through the lines in the stylesheets
				for (a = 0; a < lines.length; a++) {
						
					// split lines with multiple rules into separate lines.
					var clean_array = split_rules(lines[a]);
					
					// Now that we have the split rules we again need to split them into lines
					var clean_lines = split_lines(clean_array);
					
					// Now that we definitely have individual lines we can perform the search and replace
					for (x=0; x < clean_lines.length; x++) {
						// Don't waste our time converting irrelevant lines
						if (clean_lines[x].indexOf('}') == -1 && clean_lines[x].indexOf('{') == -1 && clean_lines[x].indexOf("\n") == -1) {
							var line = clean_lines[x];
							
							log('Line ' + a + '|' + x + ': ' + line);
							
							if (line.indexOf('rem') >= 0 && (line.indexOf('rem') > line.indexOf(':'))) {
							
							log(lines);
							// parse the rem unit
							
							// get the property
							var prop = line.split(':');
							if (prop.length === 2) {
								prop = prop[1];
								prop = prop.replace(';', '');
								
								var val = parseFloat(prop);
								
								// Now multiply the rem buy the font-size
								var new_font_size = (val * parseFloat(base_font_size));
								
								new_font_size = ' ' + new_font_size + 'px';
								
								// replace the property stylesheet wide
	
								var strReplaceAll = styles;
								var intIndexOfMatch = strReplaceAll.indexOf( prop );
								
								// Loop over the string value replacing out each matching
								// substring.
								while (intIndexOfMatch != -1){
									// Relace out the current instance.
									strReplaceAll = strReplaceAll.replace( prop, new_font_size)
									
									// Get the index of any next matching substring.
									intIndexOfMatch = strReplaceAll.indexOf( prop );
								}
								 log('should have replaced ' + prop + ' with ' + new_font_size + ' in ' + currentIndex);
								styles = strReplaceAll;
							} // end of if prop === 2
						} // end of if rem is after :
						} // end of converting irrenelevant lines
					} //end of for clean lines
				} // end of lines.length
				
				log('About to write to css file ' + currentIndex);
				//log(styles); // output the finished result
				
				if (document.styleSheets[currentIndex].cssText=styles) {
					var new_length = styles.length;
					log('CSS file ' + currentIndex + ' old length: ' + old_length + '. New length: ' + new_length)
				}
				
			}); // End of jquery get for the stylesheet
		} // end of the stylesheet iteration

		// Find the index of the sylesheets
		
	}
})(window);		

function log(msg) {
	if (console.log) {
//		console.log(msg);
	}
}

function dir(msg) {
	if (console.dir) {
		console.dir(msg);
	}
}

function split_rules(lines) {
	return lines.replace(';', ";\n");
}

function split_lines(lines) {
	return lines.split("\n");
}

function getFontSize() {
	// taken from https://github.com/chuckcarpenter/REM-unit-polyfill/blob/master/js/rem.js
	body = document.getElementsByTagName('body')[0]
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

