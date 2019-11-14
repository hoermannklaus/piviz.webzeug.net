/**
 * PiEngine
 */
function PiEngine (formula) {
	var sum = new BigReal ("0");
	for (var i=0; i < formula.length; i += 2) {
		var factor = formula[i];
		var denom  = formula[i+1];
		var term = BigReal_ArctanRecip (denom);
		term = term.multiplyByInteger (factor);
		sum = sum.add (term);
	}
	return sum;
}

/**
 * Calculate Pi with the given amount of digits
 */
function calculatePi(numDigits) {
	var numQuads = 3 + Math.floor((numDigits+3)/4);     // extra quads for accuracy
	BigMath_SetPrecision (numQuads);
	//var formula = [16, 5, -4, 239];             // pi = 16*arctan(1/5) - 4*arctan(1/239)
	var formula = [48, 18, 32, 57, -20, 239];   // pi = 48*arctan(1/18) + 32*arctan(1/57) - 20*arctan(1/239)
	var pi = PiEngine (formula);
	var pretty_pi = pi.toSimpleString (numDigits, 1);
	return pretty_pi;
}

/**
 * Calculate window sizes
 */
function getWindowSizes() {
	var width = $(window).width();
	var height = $(window).height();
}

$(function() {

	//getWindowSizes();
	//$(window).resize(getWindowSizes);

	var pi = calculatePi(1000);
	var len = pi.length;
	for (var i=0; i<len; i++) {
		if (pi[i] != '+') {
			$("#dots").append('<div class="dot"><div title="' + pi[i] + '" class="large-dot color' + pi[i] + '"></div><div class="small-dot color' + pi[i+1] + '"></div></div>');
		}
	}
});
