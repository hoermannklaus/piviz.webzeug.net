/*
    BigMath.js  -  Don Cross, 1 September 2007.
    Arbitrary precision real-valued math.
*/

//----------------------------------------------------------------------------------------
// Handy utility functions...

function reverse (s)
{
    s = s.toString();
    var r = "";
    for (var i=s.length-1; i >= 0; --i) {
        r += s.charAt(i);
    }
    return r;
}

function PutCommasInsideInteger (n)
{
    var s = reverse(n);                 // 123456      ==>  "654321"
    s = s.replace(/(\d{3,3})/g,"$1,");  // "654321"    ==>  "654,321,"
    s = s.replace(/,$/, "");            // "654,321,"  ==>  "654,321"
    return reverse(s);                  // "654,321"   ==>  "123,456"
}

function BigRealConvert (x)
{
    switch (typeof(x)) {
        case "string":
            return new BigReal (x);
        
        case "number":
            return new BigReal (x.toString());
            
        case "object":
            if (x.BigMathType == "BigReal") {
                return x.copy();
            } else {
                throw "Cannot convert invalid object to BigReal.";
            }
            
        default:
            throw "Cannot convert type '" + typeof(x) + "' to BigReal.";
    }
}

var BigReal_PiCache = null;

//----------------------------------------------------------------------------------------
// BigMath / BigReal classes begin here.

var BigMath = {};

BigMath.PiDigits = // 4132 decimal digits after the "3."
    "3.1415926535897932384626433832795028841971693993751058209749445923078164062862" +
    "089986280348253421170679821480865132823066470938446095505822317253594081284811" +
    "174502841027019385211055596446229489549303819644288109756659334461284756482337" +
    "867831652712019091456485669234603486104543266482133936072602491412737245870066" +
    "063155881748815209209628292540917153643678925903600113305305488204665213841469" +
    "519415116094330572703657595919530921861173819326117931051185480744623799627495" +
    "673518857527248912279381830119491298336733624406566430860213949463952247371907" +
    "021798609437027705392171762931767523846748184676694051320005681271452635608277" +
    "857713427577896091736371787214684409012249534301465495853710507922796892589235" +
    "420199561121290219608640344181598136297747713099605187072113499999983729780499" +
    "510597317328160963185950244594553469083026425223082533446850352619311881710100" +
    "031378387528865875332083814206171776691473035982534904287554687311595628638823" +
    "537875937519577818577805321712268066130019278766111959092164201989380952572010" +
    "654858632788659361533818279682303019520353018529689957736225994138912497217752" +
    "834791315155748572424541506959508295331168617278558890750983817546374649393192" +
    "550604009277016711390098488240128583616035637076601047101819429555961989467678" +
    "374494482553797747268471040475346462080466842590694912933136770289891521047521" +
    "620569660240580381501935112533824300355876402474964732639141992726042699227967" +
    "823547816360093417216412199245863150302861829745557067498385054945885869269956" +
    "909272107975093029553211653449872027559602364806654991198818347977535663698074" +
    "265425278625518184175746728909777727938000816470600161452491921732172147723501" +
    "414419735685481613611573525521334757418494684385233239073941433345477624168625" +
    "189835694855620992192221842725502542568876717904946016534668049886272327917860" +
    "857843838279679766814541009538837863609506800642251252051173929848960841284886" +
    "269456042419652850222106611863067442786220391949450471237137869609563643719172" +
    "874677646575739624138908658326459958133904780275900994657640789512694683983525" +
    "957098258226205224894077267194782684826014769909026401363944374553050682034962" +
    "524517493996514314298091906592509372216964615157098583874105978859597729754989" +
    "301617539284681382686838689427741559918559252459539594310499725246808459872736" +
    "446958486538367362226260991246080512438843904512441365497627807977156914359977" +
    "001296160894416948685558484063534220722258284886481584560285060168427394522674" +
    "676788952521385225499546667278239864565961163548862305774564980355936345681743" +
    "241125150760694794510965960940252288797108931456691368672287489405601015033086" +
    "179286809208747609178249385890097149096759852613655497818931297848216829989487" +
    "226588048575640142704775551323796414515237462343645428584447952658678210511413" +
    "547357395231134271661021359695362314429524849371871101457654035902799344037420" +
    "073105785390621983874478084784896833214457138687519435064302184531910484810053" +
    "706146806749192781911979399520614196634287544406437451237181921799983910159195" +
    "618146751426912397489409071864942319615679452080951465502252316038819301420937" +
    "621378559566389377870830390697920773467221825625996615014215030680384477345492" +
    "026054146659252014974428507325186660021324340881907104863317346496514539057962" +
    "685610055081066587969981635747363840525714591028970641401109712062804390397595" +
    "156771577004203378699360072305587631763594218731251471205329281918261861258673" +
    "215791984148488291644706095752706957220917567116722910981690915280173506712748" +
    "583222871835209353965725121083579151369882091444210067510334671103141267111369" +
    "908658516398315019701651511685171437657618351556508849099898599823873455283316" +
    "355076479185358932261854896321329330898570642046752590709154814165498594616371" +
    "802709819943099244889575712828905923233260972997120844335732654893823911932597" +
    "463667305836041428138830320382490375898524374417029132765618093773444030707469" +
    "211201913020330380197621101100449293215160842444859637669838952286847831235526" +
    "582131449576857262433441893039686426243410773226978028073189154411010446823252" +
    "716201052652272111660396665573092547110557853763466820653109896526918620564769" +
    "312570586356620185581007293606598764861179104533488503461136576867532494416680"
;

BigMath.radixLog10 = 4;
BigMath.radix = Math.pow (10, BigMath.radixLog10);
BigMath.maxPrecision = Math.floor(BigMath.PiDigits.length/4);    // the browser is already getting cranky by this time!
BigMath_SetPrecision (20);
BigMath.maxFactor = Math.floor ((Math.pow(2,31) - 1) / BigMath.radix);    // the biggest integer we can multiply by... not mascara!
BigMath.maxExponent = Math.floor (999999999999999 / BigMath.radixLog10);  // JavaScript integers can be bigger, but this is the largest we can multiply by 4 without scientific notation.

function BigMath_SetPrecision (nquads)
{
    if (nquads < 2 || nquads > BigMath.maxPrecision) {
        throw "BigMath_Set_precision(" + nquads + "): value is out of bounds.";
    }
    BigMath.precision = nquads;     // number of quads of precision we keep for calculations
    BigReal_PiCache = null;     // force regeneration next time pi is requested via BigMath.pi().
}

var FloatPattern = /^[\+\-]?[0-9]*(\.?[0-9]*)([eE][\+\-]?[0-9]+)?$/;

BigMath.CheckDecimalString = function (s)
{
    if (!FloatPattern.test(s)) {
        throw "Invalid decimal string '" + s + "'.";
    }
}

BigMath.MakeDecimalString = function (x)
{
    if (x == null) {
        x = "0";
    } else {
        x = x.toString().toLowerCase();     // allows us to easily search for "e" for exponent later
        BigMath.CheckDecimalString (x);
    }   
    
    return x;
}

BigMath.Mod = function (a, b)
{
    // We need a MOD operator that works on positive or negative numbers, unlike the
    // built-in ones.  We want -1 MOD 4 = 3, not -1 % 4 = -1.
    //      n   (n % 4)     (n MOD 4)
    //      4        0       0
    //      3        3       3
    //      2        2       2
    //      1        1       1
    //      0        0       0
    //     -1       -1       3
    //     -2       -2       2
    //     -3       -3       1
    //     -4        0       0
    var r = a % b;
    return (r < 0) ? (b + r) : r;
}

function BigReal (s)
{
    // For the sake of efficiently creating prototyped objects internally,
    // we allow s==null to create a quickie "0" value.
    // This code would still work right even without this 'if' statement,
    // but it makes things much faster.
    if (s == null) {
        this.mantissa = [];
        this.exponent = 0;
        this.polarity = 0;
        return;
    }

    var mantissa;
    var exponent;
    var i;

    s = BigMath.MakeDecimalString (s);
    if (s.charAt(0) == "+") {
        s = s.substring(1);
        this.polarity = 1;
    } else if (s.charAt(0) == "-") {
        s = s.substring(1);
        this.polarity = -1;
    } else {
        this.polarity = 1;
    }
    
    var expIndex = s.indexOf ("e");
    if (expIndex < 0) {
        mantissa = s;
        exponent = 0;
    } else {
        mantissa = s.substring (0, expIndex);
        exponent = parseInt (s.substring (1+expIndex));
    }
    
    // The mantissa string and exponent integer are related.
    // For example, (mantissa = "1.2345", exponent = 2) should be treated the same as
    // (mantissa = "123.45", exponent = 0).
    // Another issue is that these are expressed in base 10, but we want to convert to base BigMath.radix.
    
    var dotIndex = mantissa.indexOf(".");
    if (dotIndex >= 0) {
        // Always make mantissa look like an integer... remove the "."
        mantissa = mantissa.substring(0,dotIndex) + mantissa.substring(1+dotIndex);
        
        // We want "exponent" to indicate a correction for the lowest digit stored.
        // We store digits from least significant to most significant.
        exponent -= (mantissa.length - dotIndex);
    }
    
    // Now convert to the desired radix...
    // But first we may have to append some zeroes to the mantissa to correct for
    // the exponent mismatching radix.  For example, if exponent=7, we should append
    // append 3 zeroes to mantissa and subtract 3, giving an exponent divisible by 4.
    // This is because each exponent of 1 in the base 10000 number equals 4 in the base 10 number,
    // and we want to be able to just divide by 4.
    // If the exponent is -1, e.g. "123e-1" = 12.3 = 0012 . 3000, 
    // we want to append 3 zeroes and subtract 3 from exponent: 123000e-4 = [3000, 0123]q-1.  
    
    var numZeroesToAppend = BigMath.Mod (exponent, BigMath.radixLog10);
    exponent -= numZeroesToAppend;
    for (i=0; i < numZeroesToAppend; ++i) {
        mantissa += "0";
    }
    
    var numZeroesToPrepend = BigMath.radixLog10 - BigMath.Mod (mantissa.length, BigMath.radixLog10);
    for (i=0; i < numZeroesToPrepend; ++i) {
        mantissa = "0" + mantissa;
    }
    
    var digit = 0;
    var basis = 1;
    this.mantissa = [];
    
    // "123456789" --> [6789, 2345, 0001]    
    for (i = 0; i < mantissa.length; ++i) {
        digit = 10*digit + parseInt(mantissa.charAt(i));
        basis *= 10;
        if (basis >= BigMath.radix) {   // this works only if BigMath.radix is a positive integer power of 10.
            // time to emit another big digit
            var residue = digit % BigMath.radix;
            this.mantissa.unshift (residue);
            digit = (digit - residue) / BigMath.radix;
            basis = 1;
        }
    }
    
    if (digit > 0) {
        this.mantissa.unshift (digit);
    }
    
    this.exponent = exponent / BigMath.radixLog10;
    BigReal_Normalize (this);
}

BigReal.prototype.BigMathType       = "BigReal";
BigReal.prototype.toString          = BigRealToString;
BigReal.prototype.toSimpleString    = BigRealToSimpleString;
BigReal.prototype.toHtml            = BigRealToHtml;
BigReal.prototype.digit             = BigReal_GetDigit;
BigReal.prototype.copy              = BigReal_Copy;
BigReal.prototype.minPower          = BigReal_MinPower;
BigReal.prototype.maxPower          = BigReal_MaxPower;
BigReal.prototype.neg               = BigReal_Negate;
BigReal.prototype.add               = BigReal_Add;
BigReal.prototype.sub               = BigReal_Subtract;
BigReal.prototype.mul               = BigReal_Multiply;
BigReal.prototype.div               = BigReal_Divide;
BigReal.prototype.divideByInteger   = BigReal_DivideByInteger;
BigReal.prototype.multiplyByInteger = BigReal_MultiplyByInteger;
BigReal.prototype.abs               = BigReal_AbsoluteValue;
BigReal.prototype.sqrt              = BigReal_SquareRoot;
BigReal.prototype.introot           = BigReal_IntegerRoot;
BigReal.prototype.recip             = BigReal_Reciprocal;
BigReal.prototype.intpow            = BigReal_IntegerPower;
BigReal.prototype.exp               = BigReal_Exp;
BigReal.prototype.ln                = BigReal_Ln;
BigReal.prototype.pow               = BigReal_Pow;
BigReal.prototype.cos               = BigReal_Cosine;
BigReal.prototype.sin               = BigReal_Sine;
BigReal.prototype.tan               = BigReal_Tangent;
BigReal.prototype.arctan            = BigReal_Arctan;
BigReal.prototype.arctan2           = BigReal_Arctan2;
BigReal.prototype.floor             = BigReal_Floor;
BigReal.prototype.mod               = BigReal_Mod;
BigReal.prototype.fixAngle          = BigReal_FixAngle;
BigReal.prototype.isZero            = function() { return this.polarity == 0; }
BigReal.prototype.isNegative        = function() { return this.polarity  < 0; }
BigReal.prototype.isPositive        = function() { return this.polarity  > 0; }
BigReal.prototype.gt                = function(other) { return BigReal_Compare(this,other)  < 0; }
BigReal.prototype.lt                = function(other) { return BigReal_Compare(this,other)  > 0; }
BigReal.prototype.eq                = function(other) { return BigReal_Compare(this,other) == 0; }
BigReal.prototype.ge                = function(other) { return BigReal_Compare(this,other) <= 0; }
BigReal.prototype.le                = function(other) { return BigReal_Compare(this,other) >= 0; }

//------------------------------------------------------------------------
// The following functions work only if BigComplex is included...
BigReal.prototype.cis = function()
{
    return new BigComplex (this.cos(), this.sin());
}
//------------------------------------------------------------------------

function BigReal_Negate()
{
    var x = this.copy();
    x.polarity *= -1;
    return x;
}

function BigReal_Floor()
{
    var trunc = this.copy();
    
    //                           p=-2  p=-1  p=0   p=+1
    // "1234 5678 . 3333 2727 = [2727, 3333, 5678, 1234] q-2
    //                           i=0   i=1   i=2   i=3
    // The index of the units place is i = -exponent.
    var num_digits_chopped = 0;
    while (trunc.exponent < 0 && trunc.mantissa.length > 0) {
        trunc.mantissa.shift();     // eat the least significant quad
        ++trunc.exponent;
        ++num_digits_chopped;
    }

    trunc = BigReal_Normalize (trunc);      // fix polarity or other issues.
    
    if (this.polarity < 0 && num_digits_chopped > 0) {
        trunc = trunc.sub(new BigReal("1"));    // FIXFIXFIX: would be nice to have subtractInteger.
    }
    
    return trunc;
}

BigMath.pi = function()
{
    if (BigReal_PiCache == null) {
        // Either this is the first time anyone has requested pi,
        // or the precision has changed since pi was last used.
        BigReal_PiCache = new BigReal (BigMath.PiDigits);
    }
    return BigReal_PiCache;
}

function BigReal_Reciprocal()
{
    return (new BigReal("1")).div (this);
}

function BigReal_AbsoluteValue()
{
    var x = this.copy();
    if (x.polarity < 0) {
        x.polarity = +1;
    }
    return x;
}

function BigReal_MultiplyByInteger (factor)
{
    var product;
    
    if (factor == 0 || this.isZero()) {
        product = new BigReal("0");
    } else {
        var absFactor = Math.abs (factor);
        if (absFactor > BigMath.maxFactor) {
            throw "Tried to multiply by integer " + factor + ", but max allowed factor is " + BigMath.maxFactor + ".";
        }
        
        product = new BigReal();
        product.polarity = this.polarity * ((factor < 0) ? -1 : +1);
        product.exponent = this.exponent;
        product.mantissa = [];

        factor = absFactor;
        var carry = 0;
        for (var i=0; (carry > 0) || (i < this.mantissa.length); ++i) {
            var term = this.mantissa[i];
            if (term == null) {
                term = 0;
            }
            term = (term * factor) + carry;
            var digit = term % BigMath.radix;
            carry = (term - digit) / BigMath.radix;
            product.mantissa[i] = digit;
        }
        
        BigReal_Normalize (product);
    }
    
    return product;
}

function BigReal_DivideByInteger (denom)
{
    if (denom == 0) {
        throw "Division by zero.";
    } else {
        var polarity = (denom < 0) ? -1 : +1;
        if (denom < 0) {
            denom = -denom;
        }
        
        if (denom > BigMath.maxFactor) {
            throw "Integer denominator " + (polarity * denom) + " is too large.";
        }
        
        var ratio = new BigReal();
        ratio.polarity = this.polarity * polarity;
        ratio.mantissa = [];
        
        // Compute digits backwards, then reverse at the end.
        var backwards = [];
        var carry = 0;
        for (var i=0; i <= BigMath.precision + 2; ++i) {    // extra 2 digits so the number gets rounded during normalize.
            num = carry * BigMath.radix;
            var digit = this.mantissa[this.mantissa.length - 1 - i];
            if (digit == null) {
                if (num == 0) {
                    break;  // no more digits matter
                }
            } else {
                num += digit;
            }
            carry = num % denom;
            backwards[i] = (num - carry) / denom;
        }
        
        while (backwards.length > 0) {
            ratio.mantissa.push (backwards.pop());
        }

        ratio.exponent = this.exponent + (this.mantissa.length - ratio.mantissa.length);
        return BigReal_Normalize (ratio);
    }
}

function BigReal_Normalize (x)
{
    // Remove leading zeroes...
    while ((x.mantissa.length > 0) && (x.mantissa[x.mantissa.length - 1] == 0)) {
        x.mantissa.pop();
    }
        
    if (x.mantissa.length > BigMath.precision) {
        // Round off to specified precision...
        var digit;
        while (x.mantissa.length > BigMath.precision) {
            digit = x.mantissa.shift();
            ++x.exponent;
        }
        
        // Use the final digit we popped off the end to determine whether or not to round up...
        if (digit >= BigMath.radix / 2) {
            // Round up by adding 1 to the lowest remaining digit.
            // Cascade carries as needed...
            for (var i=0; ; ++i) {
                if (i == x.mantissa.length) {
                    x.mantissa[i] = 1;
                    break;
                } else {
                    if (++x.mantissa[i] == BigMath.radix) {
                        x.mantissa[i] = 0;
                    } else {
                        break;
                    }
                }
            }
        }
    }

    // Remove trailing zeroes...
    while ((x.mantissa.length > 0) && (x.mantissa[0] == 0)) {
        x.mantissa.shift();
        ++x.exponent;
    }
    
    if (x.mantissa.length == 0) {
        // The value of x is exactly 0, so it doesn't really matter what the exponent is.
        // Let's set exponent = 0 so it always has a consistent value.
        x.exponent = 0;
        
        // Special case: x is neither negative nor positive, so set polarity to 0.
        x.polarity = 0;
    } else {
        // Look for exponent overflow/underflow.
        // We can no longer trust an exponent being exact once it exceeds
        // the integer limit of JavaScript.
        // In actuality, JavaScript exponents can get larger without loss of precision, 
        // but we limit to exponents that we can convert to decimal (multiply by 4)
        // without the string representation going to scientific notation.
        // For example, we never want to see "1.234e+5.734e+15".
        if (Math.abs(x.exponent) > BigMath.maxExponent) {
            throw "Exponent overflow/underflow: " + x.exponent + ".";
        }
    }
    
    return x;
}

function BigReal_MinPower()
{
    return this.exponent;
}

function BigReal_MaxPower()
{
    return this.exponent + this.mantissa.length - 1;
}

function BigReal_Copy()
{
    var copy = new BigReal();
    copy.polarity = this.polarity;
    copy.exponent = this.exponent;
    copy.mantissa = [];
    for (var i=0; i < this.mantissa.length; ++i) {
        copy.mantissa[i] = this.mantissa[i];
    }
    return copy;
}

function BigReal_GetDigit (power)
{
    //                 p=0    p=-1 p=-2 p=-3
    // 1234 5678 e-3 = 0000 . 0000 1234 5678    m[p-e]
    // m[1] m[0]                   m[1] m[0]
    var index = power - this.exponent;
    if (index < 0 || index >= this.mantissa.length) {
        return 0;
    } else {
        return this.mantissa[index];
    }
}

function BigRealToString()
{
    var s;
    
    if (this.isZero()) {
        s = "0";
    } else {
        s = "";
        for (var i=0; i < this.mantissa.length; ++i) {
            var digit = this.mantissa[i].toString();
            while (digit.length < BigMath.radixLog10) {
                digit = "0" + digit;
            }
            s = digit + " " + s;
        }
        if (this.exponent != 0) {
            s += " q";  // use 'q' instead of 'e' to emphasize that this is a quad exponent, not base 10.
            if (this.exponent > 0) {
                s += "+";
            }
            s += this.exponent.toString();
        }
        s = ((this.polarity > 0) ? "+" : "-") + s;        
    }
    return s;
}

function QuadString (quad)
{
    var s = quad.toString();
    while (s.length < BigMath.radixLog10) {
        s = "0" + s;
    }
    return s;
}

function BigRealToSimpleString (numDigits, grouping)
{
    var s;

    if (this.isZero()) {
        s = "0";
    } else {
        s = "";
        for (var i = this.mantissa.length - 1; i >= 0; --i) {
            s += QuadString (this.mantissa[i]);
        }
        var numDigitsDeleted = 0;
        while (s.charAt(numDigitsDeleted) == '0') {
            ++numDigitsDeleted;            
        }
        s = s.charAt(numDigitsDeleted) + '.' + s.substring(1+numDigitsDeleted);
        if (s.length > numDigits - 1) {
            s = s.substring (0, numDigits - 1);     // exclude decimal point from count
        }
        var power = (BigMath.radixLog10 * this.maxPower()) + (BigMath.radixLog10 - (numDigitsDeleted+1));
        if (power == 0) {
            power = "";
        } else if (power > 0) {
            power = "e+" + power.toString();
        } else {
            power = "e" + power.toString();
        }
        s += power;
        if (this.isNegative()) {
            s = "-" + s;
        } else {
            s = "+" + s;
        }
    }
    
    return s;
}

function BigRealToHtml (numDigits, grouping)
{
    if (numDigits == null) {
        numDigits = this.mantissa.length * 4;
    }
    if (grouping == null) {
        grouping = 5;
    }
    var ugly = this.toString();
    var pretty = BigReal_FormatHtml (ugly, numDigits, grouping);
    return "<code><pre>" + pretty + "</pre></code>";
}

function BigReal_FormatHtml (ugly, numDigits, grouping)
{
    // ugly = "+0003 1415 9265 3589 7932 ... 0348 2534 2117 e-24"
    var qindex = ugly.indexOf("q");
    var qexponent;
    if (qindex >= 0) {
        qexponent = parseInt (ugly.substring(1+qindex));
    } else {
        qexponent = 0;
    }
    var pretty = ugly.replace(/q.*$/, "");      // Chop off "q-24" at the end
    pretty = pretty.replace (/\s/g, "");        // squish quad spaces.
    var rawDecimalDigits = pretty.length;
    var sign_char = pretty.charAt(0);
    if (sign_char=='+' || sign_char=='-') {
        --rawDecimalDigits;      // exclude '+' or '-' at front from length calculation
    } else {
        return "0";     // special case: the number is 0, because it has no sign.
    }
    pretty = pretty.replace(/^[\+\-]?0*/,"");        // Chop off "+000" from the front
    
    // 1234 5678 q+0  ==>  1.2345678 e+7
    // 1234 5678 q-1  ==>  1.2345678 e+3
    var exponent = (4 * qexponent) + (pretty.length - 1);
    
    var first_digit = pretty.charAt(0);         // we want to format like "1.2345...e+xx"
    pretty = pretty.substring (1);              // this is the part after the decimal        
    pretty = pretty.substring (0, numDigits);   // truncate at user-specified position
    
    var re = new RegExp ("([0-9]{"+grouping+","+grouping+"})", "g");
    
    pretty = pretty.replace(re,"$1 ").replace(/\s$/, "");   // repackage in specified groups of digits
    var list = pretty.split(/\s/g);
    pretty = first_digit + ".";
    var column = 0;
    var MAX_COLUMN = 10;
    for (var i=0; i < list.length; ++i) {
        if (++column > MAX_COLUMN) {
            pretty += "\n  ";
            column = 1;
        }
        if (i > 0) {
            pretty += " ";
        }
        pretty += list[i].toString();
    }
    pretty = pretty.replace (/\.?[0\s]*$/, "");      // chop off ".", ".0", ".000 000", etc. from end
    if (exponent != 0) {
        if (column == MAX_COLUMN) {
            pretty += "\n";
        } else {
            pretty += " ";
        }
        pretty += "&times; 10<sup>" + PutCommasInsideInteger(exponent) + "</sup>";
    }
    if (sign_char == '-') {
        sign_char = "&minus;";
    } else if (sign_char != '+') {
        sign_char = "";     // should only happen for 0
    }
    return sign_char + pretty;
}

function BigReal_AddAbsolute (a, b)
{
    // Returns |a| + |b|.
    // Swap so that |a| has higher or same max power as |b|.
    if (a.maxPower() < b.maxPower()) {
        var t = a;
        a = b;
        b = t;
    }

    // Safety valve to prevent excessive memory use:
    // If the lowest power in 'a' is orders of magnitude
    // greater than the highest power in 'b', just return 'a'.
    if (a.minPower() - b.maxPower() > BigMath.precision + 1) {
        return a.copy();
    }
    
    var minpow = Math.min (a.minPower(), b.minPower());
    var maxpow = a.maxPower();
    var c = new BigReal();
    c.exponent = minpow;
    c.mantissa = [];
    c.polarity = 1;
    var carry = 0;
    for (var p=minpow; (p <= maxpow) || (carry > 0); ++p) {
        var sum = a.digit(p) + b.digit(p) + carry;
        var digit = sum % BigMath.radix;
        carry = (sum - digit) / BigMath.radix;
        c.mantissa.push (digit);
    }
    
    return BigReal_Normalize (c);
}


function BigReal_SubtractAbsolute (a, b)
{
    // Returns | |a| - |b| |.
    
    // Swap so that |a| >= |b|.
    if (BigReal_CompareAbsolute(a,b) > 0) {
        var t = a;
        a = b;
        b = t;
    }
    
    // Safety valve to prevent excessive memory use:
    // If the lowest power in 'a' is orders of magnitude
    // greater than the highest power in 'b', just return 'a'.
    if (a.minPower() - b.maxPower() > BigMath.precision + 1) {
        return a.copy();
    }
        
    var minpow = Math.min (a.minPower(), b.minPower());
    var maxpow = a.maxPower();
    var c = new BigReal();
    c.exponent = minpow;
    c.mantissa = [];
    c.polarity = 1;
    
    var borrow = 0;
    for (var p=minpow; p <= maxpow; ++p) {
        var diff = a.digit(p) - b.digit(p) - borrow;
        if (diff < 0) {
            borrow = 1;
            diff += BigMath.radix;
        } else {
            borrow = 0;
        }
        c.mantissa.push (diff);
    }
    
    return BigReal_Normalize (c);
}

function BigReal_Add (other)
{
    var sum;
    
    if (this.isZero()) {
        sum = other.copy();     // 0 + other = other
    } else if (other.isZero()) {
        sum = this.copy();      // this + 0 = this
    } else if (this.polarity == other.polarity) {
        sum = BigReal_AddAbsolute (this, other);
        sum.polarity = this.polarity;
    } else {
        // The numbers are of opposite polarity.
        sum = BigReal_SubtractAbsolute (this, other);
        var compare = BigReal_CompareAbsolute (this, other);        
        if (compare != 0) {
            // Use the polarity of whichever one had the larger absolute value...
            sum.polarity = (compare > 0) ? other.polarity : this.polarity;
        }                
    }

    return sum;    
}


function BigReal_Subtract (other)
{
    var diff;
    
    if (this.isZero()) {
        diff = other.copy();
        diff.polarity *= -1;    // 0 - other = -other
    } else if (other.isZero()) {
        diff = this.copy();     // this - 0 = this
    } else if (this.polarity == other.polarity) {
        diff = BigReal_SubtractAbsolute (this, other);
        diff.polarity = -BigReal_Compare (this, other);        
    } else {
        // The numbers are of opposite polarity:  -3 - (+5) = -8, or +3 - (-5) = +8.  this.polarity is used for polarity of result.
        diff = BigReal_AddAbsolute (this, other);
        diff.polarity = this.polarity;
    }

    return diff;    
}


function BigReal_CompareAbsolute (a, b)
{
    var maxpow = Math.max (a.maxPower(), b.maxPower());
    var minpow = Math.min (a.minPower(), b.minPower());
    for (var p=maxpow; p >= minpow; --p) {
        var diff = b.digit(p) - a.digit(p);
        if (diff != 0) {
            return (diff < 0) ? -1 : +1;
        }
    }
    return 0;   // the numbers are equal
}

function BigReal_Compare (a, b)
{
    // Returns +1 when a <  b.  (in ascending order)
    // Returns  0 when a == b.  
    // Returns -1 when a >  b.  (in descending order)
    if (a.polarity < b.polarity) {
        return +1;
    } else if (a.polarity > b.polarity) {
        return -1;
    } else if (a.polarity == 0) {
        return 0;   // both a and b are zero, so they are equal.
    } else {
        // a and b are both nonzero numbers with the same polarity (-1 or +1).
        var cmp = a.polarity * BigReal_CompareAbsolute(a,b);
        if (cmp == 0) cmp = 0;  // For some reason I have to do this to get a switch statement to work!
        return cmp;
    }
}


function BigReal_Multiply (other)
{
    var product;
    var i, k, value, digit, carry;

    if (this.isZero()) {
        product = this.copy();
    } else if (other.isZero()) {
        product = other.copy();
    } else {
        product = new BigReal();
        product.polarity = this.polarity * other.polarity;
        product.exponent = this.exponent + other.exponent;
        product.mantissa = [];
        
        var productNumDigits = this.mantissa.length + other.mantissa.length + 1;
        for (i=0; i < productNumDigits; ++i) {
            product.mantissa[i] = 0;
        } 
        
        for (i=0; i < this.mantissa.length; ++i) {
            carry = 0;
            for (k=0; k < other.mantissa.length; ++k) {
                value = carry + product.mantissa[i+k] + (this.mantissa[i] * other.mantissa[k]);
                digit = value % BigMath.radix;
                carry = (value - digit) / BigMath.radix;
                product.mantissa[i+k] = digit;
            }
            while (carry > 0) {
                value = carry + product.mantissa[i+k];
                digit = value % BigMath.radix;
                carry = (value - digit) / BigMath.radix;
                product.mantissa[i+k] = digit;
                ++k;
            }
        }
        
        BigReal_Normalize (product);
    }
    
    return product;
}

function BigReal_Divide (other)
{
    var ratio;
    
    if (other.isZero()) {
        throw "Attempt to divide by zero.";
    } else if (this.isZero()) {
        ratio = new BigReal("0");
    } else if (other.mantissa.length == 1) {
        ratio = this.divideByInteger (other.polarity * other.mantissa[0]);
        ratio.exponent -= other.exponent;
    } else {
        ratio = BigReal_DivideAbsolute (this, other);
        ratio.polarity = this.polarity * other.polarity;
    }
    
    return ratio;
}


function BigReal_Mod (other)
{
    // The real-valued remainder of this/other.
    // Example:  this=-3.2, other=1.5, ratio=-3.2/1.5 = 
    var ratio = this.div (other);
    var trunc = ratio.floor();
    return ratio.sub(trunc).mul(other);    
}


function BigReal_FixAngle()
{
    // Convert the value in radians to a value theta such that -pi < theta <= pi.
    var pi = BigMath.pi();
    var two_pi = pi.multiplyByInteger(2);
    var theta = this.mod (two_pi);      // 0 <= theta < 2*pi.
    if (theta.gt(pi)) {        // is theta > pi?
        theta = theta.sub (two_pi);     // now -pi < theta < 0.
    }
    return theta;
}


function BigReal_DivideAbsolute (a, b)
{
    // Returns |a| / |b|.
    // [0017] / [0003] = [0005 6666 6666 6666 6666 ...]
    var remainder = a.abs();
    var slider = b.abs();
    
    // Let's shift the exponents so that remainder.maxPower() and slider.maxPower() are matched.
    var expdiff = remainder.maxPower() - slider.maxPower();
    slider.exponent += expdiff;
    
    var digitlist = [];
    
    // Iterate a maximum of (precision + 2) quads, then round off.
    // This is because it is possible for the first calculated digit to be 0,
    // so we want at least one extra digit for accurate rounding.
    for (var i=0; i < 2 + BigMath.precision; ++i) {
        // Each time around this loop, we generate 1 quad of the ratio.
        // First estimate the digit using the first few digits of remainder and slider.
        var hipower = remainder.maxPower();
        var guess = Math.floor (BigReal_MantissaApprox(remainder,hipower,4) / BigReal_MantissaApprox(slider,hipower,4)) - 1;
        if (guess < 0) {
            guess = 0;
        } else if (guess >= BigMath.radix) {
            guess = BigMath.radix - 1;
        }
        
        // Adjust the guess upward until we get subtraction overflow.  Then back up by 1.
        for(;;) {
            var term = slider.multiplyByInteger (guess);
            var compare = BigReal_Compare (remainder, term);
            if (compare > 0) {      // term > remainder?
                // We overshot by 1... so back up...
                --guess;
                break;
            } else if (compare == 0) {
                // We got an exact answer!
                break;
            }
            ++guess;    // try next higher number
            goodterm = term;
            term = term.add (slider);
        }
        
        digitlist.push (guess);
        remainder = remainder.sub (slider.multiplyByInteger (guess));
        if (remainder.isZero()) {
            break;
        }
        --slider.exponent;  // divide by radix
    }
    
    // Now reverse the digits we got into ratio.mantissa.
    var ratio = new BigReal();
    ratio.mantissa = [];
    while (digitlist.length > 0) {
        ratio.mantissa.push (digitlist.pop());
    }
    
    ratio.exponent = expdiff - (ratio.mantissa.length - 1);
    ratio.polarity = 1;
    return BigReal_Normalize(ratio);
}


function BigReal_MantissaApprox (x, p, n)
{
    var sum = 0;
    for (var i=0; i < n; ++i) {
        sum = (BigMath.radix * sum) + x.digit(p-i);
    }
    return sum;
}


function BigReal_ArctanRecip (n)
{
    // Returns arctan(1/n), where n is an integer such that |n| <= BigMath.maxFactor.
    // Also, |n| must be > 1.
    var abs_n = Math.abs(n);
    if (abs_n <= 1 || abs_n > BigMath.maxFactor) {
        throw "BigMath_ArctanRecip(" + n + "): argument is out of range.";
    }
    var polarity = (n < 0) ? -1 : +1;
    n = abs_n;
    
    // arctan(x)   = x - x^3/3 + x^5/5 - x^7/7 + x^9/9 - ... .
    // arctan(1/n) = 1/n - 1/(3*n^3) + 1/(5*n^5) - ... .
    // Strategy: let k = every positive odd integer.
    // For each such k, maintain recip = 1/n^k, then calculate term = recip/k.
    // Start with 1/n, then keep dividing by n^2 (or n twice when n is too large).
    // We need to alternately add or subtract.
    
    var sum = (new BigReal("1")).divideByInteger(n);
    var recip = sum;
    var toggle = -1;
    
    var n_squared = n * n;
    var fastDivide = (n_squared <= BigMath.maxFactor);
    
    for (var k=3; ; k += 2, toggle = -toggle) {
        if (fastDivide) {
            recip = recip.divideByInteger(n_squared);
        } else {
            recip = recip.divideByInteger(n).divideByInteger(n);
        }
        var term = recip.divideByInteger (toggle * k);
        var next_sum = sum.add (term);
        // We keep iterating until the term being added has a maxPower too small to affect the sum.
        if (next_sum.eq(sum)) {
            break;
        }
        sum = next_sum;
    }
    
    sum.polarity *= polarity;
    return sum;
}


function BigReal_Arctan()
{
    if (this.isZero()) {
        return this.copy();     // prevent division by zero: arctan(0) = 0
    }

    // arctan(x)   = x - x^3/3 + x^5/5 - x^7/7 + x^9/9 - ... .
    // http://mathforum.org/library/drmath/view/51875.html
    var negative = this.isNegative();
    var x = this.abs();

    // The series diverges for x > 1, so in that case use arctan(x) = pi/2 - arctan(1/x).
    // For x close to 1, the series converges very slowly, so use arctan(x) = 2*arctan[(sqrt[1 + x^2]-1)/x].
    // Note that arctan(-x) = -arctan(x).
    var sum;
    
    var one = new BigReal("1");
    if (x.gt(one)) {
        var halfpi = BigMath.pi().divideByInteger(2);
        sum = halfpi.sub(x.recip().arctan());
    } else {
        var half = one.divideByInteger(2);
        if (x.gt(half)) {
            var reduced = x.mul(x).add(one).sqrt().sub(one).div(x);
            sum = reduced.arctan().multiplyByInteger(2);
        } else {
            var neg_x_squared = x.mul(x).neg();     // -x^2, so every time we multiply, the sign toggles
            var x_power = x;
            var n = 1;
            sum = x;
            
            for(;;) {
                n += 2;
                x_power = x_power.mul (neg_x_squared);
                var term = x_power.divideByInteger (n);
                var next_sum = sum.add (term);
                if (next_sum.eq(sum)) {
                    break;
                }
                sum = next_sum;
            }
        }
    }
        
    if (negative) {
        sum = sum.neg();
    }
    
    return sum;
}


function BigReal_Arctan2 (x)    // returns arctan(this/x), corrected for quadrant
{
    var angle;
    
    if (x.isZero()) {
        if (this.isZero()) {
            throw "Cannot take arctan2(0,0).";
        }
        angle = BigMath.pi().divideByInteger(2);
        if (this.isNegative()) {
            angle = angle.neg();
        }
    } else {
        angle = this.div(x).arctan();
        if (x.isNegative()) {
            angle = angle.add (BigMath.pi());
        }
    }
    
    return angle;
}


function BigReal_SquareRoot()
{
    return this.introot(2);
}


function BigReal_IntegerRoot (n)
{
    if (typeof(n) != "number") {
        throw "BigReal_IntegerRoot: argument is not numeric.";
    }

    if (n == 0) {
        throw "Not allowed to raise real to 1/0 power.";
    }
    
    if (this.isZero()) {
        // The root-finding formula doesn't work for zero, because it would divide by zero.
        if (n < 0) {
            throw "BigReal_IntegerRoot:  not allowed to take negative root (" + n + ") of zero.";
        } else {
            return this.copy();     // any positive root of zero is also zero.
        }        
    }

    var need_recip = (n < 0);
    var need_negative = (this.polarity < 0);
    
    var abs_n = Math.abs(n);    
    if (abs_n >= BigMath.radix) {
        throw "Root is too large: " + n + ".";
    }
    
    if (n != Math.floor(n)) {
        throw "Not allowed to take non-integer root: " + n + ".";
    }

    n = abs_n;
    if (need_negative && (n % 2 == 0)) {
        throw "BigReal_IntegerRoot:  not allowed to take even integer root of a negative number.";
    }
    
    var abs_this;
    if (need_negative) {
        abs_this = this.copy();
        abs_this.polarity = 1;
    } else {
        abs_this = this;
    }

    // calculate initial guess...

    var approx = BigReal_MantissaApprox (abs_this, abs_this.maxPower(), 2) / BigMath.radix;
    var exponent = abs_this.exponent;
    var exponent_residue = BigMath.Mod (exponent, n);
    exponent -= exponent_residue;
    approx *= Math.pow (BigMath.radix, exponent_residue);
    approx = Math.round (Math.pow(approx, 1.0/n));
    exponent /= n;

    root = new BigReal();
    root.mantissa = [approx];
    root.polarity = 1;
    root.exponent = exponent;
    BigReal_Normalize (root);
    
    // iterate corrections...
    // We want to calculate x = y^(1/n).  So y = x^n.
    // dx = dy / (n * x^(n-1)) = (y - x^n) / (n * x^(n-1)) = (y*x^(1-n) - x)/n.
    var prev_abs_correction = null;
    for(;;) {
        var correction = root.intpow(1-n).mul(abs_this).sub(root).divideByInteger(n);
        var abs_correction = correction.abs();
        if (prev_abs_correction != null && abs_correction.ge(prev_abs_correction)) {
            break;  // the correction got bigger: that means things aren't going to get any better.
        }
        prev_abs_correction = abs_correction;
        
        var better = root.add (correction);
        if (better.eq(root)) {
            break;
        }
        root = better;
    }        
    
    if (need_recip) {
        root = root.recip();
    }
    
    if (need_negative) {
        root.polarity *= -1;
    }
    
    return root;
}


function BigReal_IntegerPower (n)
{
    if (typeof(n) != "number") {
        throw "BigReal_IntegerPower: argument is not numeric.";
    }

    if (n != Math.floor(n)) {
        throw "BigReal_IntegerPower: expected integer, but n = " + n + ".";
    }
    
    var need_recip = (n < 0);
    if (need_recip) {
        n = -n;
    }
    
    var product = new BigReal("1");
    var square = this;      // squared zero times
    
    // The naive way of looping n times and multiplying by 'this' is very inefficient when n is large.
    // Instead we look at each bit in n and decide whether that square of 'this' should be included.
    // For example, to raise something to the power 5 (101 binary) means this^4 * this^1.
    if (n > 0) {
        for(;;) {
            var bit = n % 2;
            if (bit == 1) {
                product = product.mul (square);
            }
            n = (n - bit) / 2;
            if (n == 0) {
                break;      // squaring can be expensive... don't waste time doing it unless needed            
            }
            square = square.mul (square);
        }
    }
    
    if (need_recip) {
        product = product.recip();
    }
    
    return product;
}


function BigReal_Cosine()
{
    // http://mathworld.wolfram.com/Cosine.html
    // cos(x) = x^0/0! - x^2/2! + x^4/4! - x^6/y! + ...
    var x = this.fixAngle();    // adjust angle to a value that converges
    var toggle = 1;
    var sum, xpower, denom;
    var x_squared = x.mul(x);
    sum = xpower = denom = new BigReal("1");
    var n = 0;
    
    for(;;) {
        denom = denom.divideByInteger (++n);
        denom = denom.divideByInteger (-(++n));     // sign toggle and factorial at the same time!
        xpower = xpower.mul (x_squared);
        var term = xpower.mul (denom);
        var next_sum = sum.add (term);
        if (next_sum.eq(sum)) {
            break;  // the series has converged!
        }
        sum = next_sum;
    }
    
    return sum;
}


function BigReal_Sine()
{
    // http://mathworld.wolfram.com/Sine.html
    // sin(x) = x^1/1! - x^3/3! + x^5/5! - ...
    
    var x = this.fixAngle();    // adjust angle to a value that converges
    var toggle = 1;
    var x_squared = x.mul(x);
    var denom = new BigReal("1");
    var sum, xpower;
    sum = xpower = x;
    var n = 1;
    
    for(;;) {
        denom = denom.divideByInteger (++n);
        denom = denom.divideByInteger (-(++n));     // sign toggle and factorial at the same time!
        xpower = xpower.mul (x_squared);
        var term = xpower.mul (denom);
        var next_sum = sum.add (term);
        if (next_sum.eq(sum)) {
            break;  // the series has converged!
        }
        sum = next_sum;
    }
    
    return sum;
}

function BigReal_Tangent()
{
    // tan(x) = sin(x) / cos(x).
    var y = this.cos();
    if (y.isZero()) {
        throw "Infinite tangent.";
    }
    
    return this.sin().div(y);
}


function BigReal_Exp()
{
    // exp(x) = x^0/0! + x^1/1! + x^2/2! + x^3/3! + ...
    var sum = new BigReal("1");
    var xpower = sum;
    var denom  = sum;
    var n = 0;
    
    for(;;) {
        denom = denom.multiplyByInteger (++n);
        xpower = xpower.mul (this);
        var next_sum = sum.add (xpower.div(denom));
        if (next_sum.eq(sum)) {
            break;
        }
        sum = next_sum;
    }
    
    return sum;
}


function BigReal_Ln()
{
    if (!this.isPositive()) {
        throw "Cannot take ln(x) for x <= 0.";
    }

    // The series for ln(x) tend to converge very slowly.
    // I have found it is better to calculate x = ln(y) by solving for y - exp(x) = 0, given y,
    // using Newton's method.
    // y = exp(x)  ==>  dy = exp(x)*dx  ==>  dx = exp(-x)*dy
    // We can use approximation to estimate the first guess very accurately.
    // ln(M * R^E) = ln(M) + E*ln(R)
    
    var mant_approx = BigReal_MantissaApprox (this, this.maxPower(), 2) / BigMath.radix;
    var approx_x = Math.log(mant_approx) + (this.exponent * Math.log(BigMath.radix));
    var x = new BigReal (approx_x);
    var one = new BigReal("1");
    var prev_abs_dx = null;
    
    for(;;) {
        var dx = this.mul(x.neg().exp()).sub(one);
        var next_x = x.add(dx);
        if (next_x.eq(x)) {
            break;
        }
        var abs_dx = dx.abs();
        if (prev_abs_dx != null) {
            if (abs_dx.ge(prev_abs_dx)) {
                // we are losing ground, which means we aren't going to get any better.
                break;
            }
        }
        prev_abs_dx = abs_dx;
        x = next_x;
    }
    
    return x;
}


function BigReal_Pow (other)
{
    if (other.mantissa.length == 1 && other.exponent == 0) {
        // Optimization: use intpow when exponent is a small integer.
        return this.intpow (other.mantissa[0] * other.polarity);
    } else {
        return this.ln().mul(other).exp();      // a^b = exp(b*ln(a))
    }
}


/*
    $Log: BigMath.js,v $
    Revision 1.44  2007/09/05 14:15:16  Don.Cross
    Found and fixed bug with introot going into infinite loop.
    Looks like I am going to have to add extra checking to avoid infinite loops:
    everywhere a value is supposed to converge, I need to check to make sure that the
    absolute value of the correction has decreased since the previous iteration.
    Otherwise, assume that the correction is small enough to ignore, and quit.

    Also started working on a toSimpleString method for callers that want
    an easy-to-process representation of a BigReal.  It is not finished...
    still needs digit grouping support.

    Revision 1.43  2007/09/04 20:13:43  Don.Cross
    Implemented general a^b.

    Revision 1.42  2007/09/04 19:34:54  Don.Cross
    Fixed alignment issue in toHtml caused by recent inclusion of '+' in front of positive numbers.

    Revision 1.41  2007/09/04 19:16:33  Don.Cross
    Implemented real-valued ln.

    Revision 1.40  2007/09/04 17:24:57  Don.Cross
    BigReal.maxPrecision was twice as big as it should be, based on number of pi digits available.
    So I made it calculated based on pi digits.
    Added real exp method.

    Revision 1.39  2007/09/04 17:10:09  Don.Cross
    Allow complex numbers to operate with other complex numbers or real numbers.
    Added cis method, which is a bit odd because it belongs to BigReal but returns BigComplex.

    Revision 1.38  2007/09/04 16:12:39  Don.Cross
    Added tan, arctan2.

    Revision 1.37  2007/09/04 15:00:01  Don.Cross
    Implemented generalized arctangent.

    Revision 1.36  2007/09/04 14:00:51  Don.Cross
    Fixed bug in integer root method:  was trying to divide by zero when taking root of zero.

    Revision 1.35  2007/09/04 13:44:32  Don.Cross
    Added more user-friendly methods to BigReal for comparison: eq, lt, isZero, etc.

    Revision 1.34  2007/09/04 02:23:37  Don.Cross
    Implemented sine function.
    Added sanity check for cos^2 + sin^2 = 1.

    Revision 1.33  2007/09/04 02:00:07  Don.Cross
    Implemented real-valued mod and cosine.

    Revision 1.32  2007/09/04 01:22:22  Don.Cross
    Starting to implement cosine, but not finished yet.
    Added pi, floor.

    Revision 1.31  2007/09/04 00:39:08  Don.Cross
    Added field to both BigReal and BigComplex, called BigMathType.
    This will allow easy discernment between BigReal and BigComplex at run time.

    Revision 1.30  2007/09/03 21:56:35  Don.Cross
    Fixed bug html formatter: was not putting minus sign on negative numbers!

    Revision 1.29  2007/09/03 21:43:48  Don.Cross
    Another formatting tweak: was not eliminating trailing zeroes from the end of the html formatted string.

    Revision 1.28  2007/09/03 21:39:45  Don.Cross
    Starting to work on BigComplex class.
    So far, constructor and add method are all I have done.

    Revision 1.27  2007/09/03 20:28:49  Don.Cross
    I have decided to make complex math a separate module from BigMath.js.
    It will be called BigComplex.js.
    That way there is less overhead for projects that do not need complex numbers.

    Revision 1.26  2007/09/03 19:57:25  Don.Cross
    Wrote general-purpose nth root algorithm, and now sqrt uses it with n=2.

    Revision 1.25  2007/09/03 17:24:14  Don.Cross
    Now when generating HTML representation of a BigReal, show the exponent with embedded commas.

    Revision 1.24  2007/09/03 16:51:53  Don.Cross
    Added safety valve for exponent overflow/underflow.

    Revision 1.23  2007/09/03 16:21:50  Don.Cross
    Error messages consistently end with '.' now.

    Revision 1.22  2007/09/03 16:19:06  Don.Cross
    Factored out reusable toHtml method.

    Revision 1.21  2007/09/03 15:23:14  Don.Cross
    I learned how to use object prototypes in JavaScript to add all the methods to my objects automatically.

    Revision 1.20  2007/09/03 14:49:18  Don.Cross
    Added integer power method intpow.
    Fixed root.html to calculate exponent correctly.
    Now use 'q' instead of 'e' to indicate quad exponent, to help avoid confusion in the future.

    Revision 1.19  2007/09/03 13:00:10  Don.Cross
    Added recip method.
    Added slight optimization to division algorithm.

    Revision 1.18  2007/09/03 01:11:08  Don.Cross
    Added square root method.

    Revision 1.17  2007/09/03 00:48:24  Don.Cross
    Fixed bugs:
    BigReal_DivideByInteger was not calculating result polarity correctly.
    BigReal_DivideAbsolute had unintentional side effect on one of its parameters,
    and was not always calculating properly.

    Revision 1.16  2007/09/03 00:43:32  Don.Cross
    First cut of general-purpose division algorithm.  Still needs more testing.

    Revision 1.15  2007/09/02 20:41:57  Don.Cross
    It looks like I can relax the limit on dividing by an integer from radix to maxFactor.
    This allowed me to optimize the arctan formula by conditionally dividing by n^2 once
    instead of n twice.
    Fixed typo in pi.html.

    Revision 1.14  2007/09/02 18:56:53  Don.Cross
    Added ability for user to specify number of quads of precision.
    Made displayed pi calculation prettier.

    Revision 1.13  2007/09/02 18:21:44  Don.Cross
    Now I can calculate pi in my browser to high precision!
    Added BigReal_ArctanRecip.

    Revision 1.12  2007/09/02 17:56:49  Don.Cross
    Added the ability to multiply by a small integer.

    Revision 1.11  2007/09/02 01:52:53  Don.Cross
    Added optimization to prevent needless waste of memory and CPU time by adding/subtracting numbers that are
    of rediculously different orders of magnitude.

    Revision 1.10  2007/09/02 01:42:02  Don.Cross
    Increased default precision to 20 quads.
    Added test to calculate e.  It works!

    Revision 1.9  2007/09/02 01:31:26  Don.Cross
    Now can divide a BigReal by a small integer (radix or less).

    Revision 1.8  2007/09/02 01:04:09  Don.Cross
    Simplified logic by re-using BigReal_CompareAbsolute.

    Revision 1.7  2007/09/02 01:00:13  Don.Cross
    Fixed normalizer to apply precision limit.

    Revision 1.6  2007/09/01 22:47:08  Don.Cross
    Now can multiply two real numbers!

    Revision 1.5  2007/09/01 22:00:39  Don.Cross
    Got polarity-based addition and subtraction working.

    Revision 1.4  2007/09/01 21:25:14  Don.Cross
    Added BigReal_Compare.

    Revision 1.3  2007/09/01 21:03:03  Don.Cross
    Realized that I want to remove extraneous zeroes from both ends of a number,
    so I renamed BigReal_RemoveLeadingZeroes to BigReal_Normalize.
    BigRealToString was not handling zero or polarity properly.
    Fixed bug in BigReal_AddAbsolute.
    Added BigReal_SubtractAbsolute.

    Revision 1.2  2007/09/01 20:20:52  Don.Cross
    First baby step in arithmetic: can add absolute values of 2 numbers.

    Revision 1.1  2007/09/01 19:25:57  Don.Cross
    Starting to write high-precision math code for JavaScript

*/
