const quoteWindow = document.querySelector(".w_main")
var showBaseQuotes = true
let baseQuotes = []
var baseQuoteIndex = 0
var doneLoading = false;


/**
 * basic function for getting a random integer
 * 
 * @param {int} max the upper value 
 * @return integer between 0 and max
 */
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

/**
 * fetch quotes from json file and return results
 */
async function getBaseQuotes() {
    let url = 'data/quotes-base.json';
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

/**
 * render the desire quote after the
 * json data has been loaded an assigned
 * to the global baseQuates array
 */
async function renderBaseQuotes() {
    baseQuotes = await getBaseQuotes();

    // get random index position to display a quote
    baseQuoteIndex = getRandomInt(baseQuotes.length)
    displayQuote()  
}

/**
 * On windowload check which page the user is on and
 * call appropriate functions
 */
window.onload = function () {
    var indexPage = document.querySelector("#index_page");
    var visitorPage = document.querySelector("#visitor_page");

    // toggle nav bar regardless of page
    navigationBarToggle();

    if(indexPage !== null) {
        toggleQuoteSource();
        setImageBackgroundPosition();

        // update quote when quote image window is clicked
        quoteWindow.addEventListener('click', displayQuote)    

        renderBaseQuotes()
        
    }
    if(visitorPage !== null) {
        document.querySelector("#visitorQuoteText").addEventListener("input", visitorQuoteCounter);
        document.querySelector("#visitorAuthorText").addEventListener("input", visitorAuthorCounter);

        // addVisitorQuote();
        postQuote();
    }
}

/**
 * get the html div for quote and author on the home page and 
 * populate with the corresponding quote from the baseQuotes
 * array at current baseQuoteIndex
 */
function displayQuote() {
    const baseQuote = document.querySelector("[data-quote]");
    const baseAuthor = document.querySelector("[data-author]");
    baseQuote.innerHTML = baseQuotes[baseQuoteIndex].quote
    baseAuthor.innerHTML = "-" +baseQuotes[baseQuoteIndex].author

    // increment index for next call
    baseQuoteIndex++
    if(baseQuoteIndex >= baseQuotes.length) {
        baseQuoteIndex = 0;
    }
}

/**
 * Control the navigation bar collapse and expand
 */
function navigationBarToggle() {
    // on menuButton click toggle show/hide menu
	$("#menuButton").click(function () {
		if ($('.e_nav').css('display') == 'none') {
			$(".e_nav").css({ display: "flex" }).show();
		} else {
			$(".e_nav").css({ display: "none" }).hide();
		}
	})
}

/**
 * Set position of background image based on current time (hour)
 * the bottom of the image is a brighter orange so have that part show
 * more during daylight and the top showing during evenings. 
 */
function setImageBackgroundPosition() {
    // Get current hour
    var crnt_hr = new Date().getHours(); 

    // have time go up to 12 then decrement
    // one per hour back to 0;
    if(crnt_hr > 12) {
        // var t = n;
        crnt_hr = (24 - crnt_hr);
    }

    //          ((value) - min) * (outMax - outMin) / (max - min) + outMin
    var mapHours = ((12 - crnt_hr) - (0)) * (0 - (-800)) / (12 - (0)) + -800;
    
    
    // Create string that represents css string
    var valueString = "center " + mapHours +"px";

    // Update sub content wrapper grid with background image at desired position
    document.querySelector(".w_main").style.backgroundPosition = valueString;  
}

/**
 * Toggle between showing the standard base of quotes or the user driven quotes
 * for now only the base quotes are visible until I find a backend solution
 * for posting and reading user submitted quotes.
 */
function toggleQuoteSource() {
    document.querySelector('#base').addEventListener('click', function(){
        showBaseQuotes = true;
        // document.querySelector("#base").style.backgroundColor = "gray";  
        // document.querySelector("#user").style.backgroundColor = "lightgray"; 

        $("#base").css("background-color","gray");
        $("#user").css("background-color","lightgray");
    });
    document.querySelector('#user').addEventListener('click', function(){
        showBaseQuotes = false;
        // document.querySelector("#base").style.backgroundColor = "lightgray"; 
        // document.querySelector("#user").style.backgroundColor = "gray"; 
        $("#base").css("background-color","lightgray");
        $("#user").css("background-color","gray");  
    });
}

/*******************************************
 * VISITOR FUNCTIONS
 *******************************************/

/**
 * Counter the number of characters in the quote input section of visitor page
 * to limit length of user submitted quotes
 */
function visitorQuoteCounter() {	
	const target = event.currentTarget;
    const maxLength = target.getAttribute("maxlength");
    const currentLength = target.value.length;
    let updateCounter = "\n" +currentLength +"/"+ maxLength.toString();
    // document.querySelector("#visitorQuoteCount").innerHTML = "\n" +currentLength +"/"+ maxLength.toString();
    $("#visitorQuoteCount").text(updateCounter);
   
}

/**
 * Counter the number of characters in the author input section of visitor page
 * to limit the length of the user submitted author
 */
function visitorAuthorCounter() {
	const target = event.currentTarget;
    const maxLength = target.getAttribute("maxlength");
    const currentLength = target.value.length;
    let updateCounter = "\n" +currentLength +"/"+ maxLength.toString();
    // document.querySelector("#visitorAuthorCount").innerHTML = "\n" +currentLength +"/"+ maxLength.toString();
    $("#visitorAuthorCount").text(updateCounter);
   
}


/**
 * Toggle the navigation bar between show/hide
 * not sure that i need this anymore
 */
// function navBarToggle() {
// 	// on menuButton click check if navigation menu is hidden
//     // or not and do the opposite 
//     document.querySelector('#menu_button').addEventListener('click', function(){
        
//         if (document.querySelector('.about').style.display == 'none') {
//             document.querySelector('.about').style.display = 'grid'
//             document.querySelector('.visitor').style.display = 'grid'
//         } else {
//             document.querySelector('.about').style.display = 'none'
//             document.querySelector('.visitor').style.display = 'none'
//         }
//    });
// }

/*******************************************
 * BACKEND FUNCTIONS
 *******************************************/

 /**
  * mock function at this point for getting data from the input fields when the 
  * user hits the post/submit button. At the moment an alert is used to show
  * the data obtained and/or errors in entry
  */
 function postQuote() {
    $("#add_button").click(function(){
        var valid = false;
        var quoteString = $("#visitorQuoteText").val();
        var authorString = $("#visitorAuthorText").val();
        var zipString = $("#visitorZipText").val();

        if (quoteString.replace(/\s/g, "").length > 0 &&
            authorString.replace(/\s/g, "").length > 0 &&
            (zipString).match(/^\d+$/) && 
            zipString.length == 5 ) {
            valid = true;   
        }

        // console.log(zipString.length == 5);

        if(valid) {
            // post
            let alertText = "You submitted: " + quoteString + " by " + authorString +  " from " + zipString
            console.log("You submitted:", quoteString, "by", authorString, "from", zipString);
            alert(alertText);
        } else {
            alert("Invalid Entry:\nQuote cannot be empty\nAuthor cannot be empty\nZip must be 5-digit zip code")
        }       
      });
 }

//  function addVisitorQuote() {
//     document.querySelector('#add_button').addEventListener('click', function(){
        
//         var quoteString = document.querySelector("#visitorQuoteText").value;
//         var authorString = document.querySelector("#visitorAuthorText").value;
//         var cityString = document.querySelector("#visitorCityText").value;
//         var stateString = document.querySelector("#visitorStateText").value;
//         var countryString = document.querySelector("#visitorCountryText").value;
//         console.log(quoteString, authorString, cityString, stateString, countryString);
//         if (quoteString == null || quoteString.trim() === ''){
//             alert("need quote")
//         }
        
//     });
//  }

 /*
  @app.route('/add', methods = ['POST'])
    def add():
    author = request.form['visitorAuthor']
    print("The author is '" + author + "'")
    return redirect('/') 

  */