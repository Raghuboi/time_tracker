/**
 * @var api_url
 * @type {string}
 * The URL that points to the main API path. All commands use this primary URL
 */
let api_url = 'https://acs2909.lusciousorange.com/t-api/';

/**
 * API KEYS
 * @type {string}
 * The three API keys for the three segments of the project. You must replace these YOUR KEYS for your respective roles.
 * @todo: clear these
 */
let api_key_time_tracking = '9zc70s9-pm96fj7gbwk8q5r6-8snkhr7'; // PERSON A
let api_key_reports = '8w0rk60-cm8zw6rdg41v92x1-4m2z5p0'; // PERSON B
let api_key_projects = '0r3tzm6-j795sz43yqvxfk19-rtpqmn0'; // PERSON C


/**
 * @var {int} company_id
 * Your company ID, you must replace this is your value once you know your company ID
 */
let company_id = 64;


/**
 * PROFILE CALL
 * This profile call must remain here as the first thing that happens in the config. It uses your API key to get the
 * profile of who is currently working.
 *
 * The code below will use your personal API key set in my_api_key.js
 * DO NOT MODIFY THIS CODE
 */
let current_api_key = my_api_key || api_key_time_tracking || api_key_reports || api_key_projects;
let my_api = new TimeTrackerApi(current_api_key, api_url);
my_api.makeRequest('GET', 'acs/profile', {}, saveUserID);
my_api = null;


/**
 * A function to save the user ID of the provide profile object
 * @param {object} profile_object
 */
function saveUserID(profile_object) {
    console.log('----- saveUserID -----', profile_object);
    // INSERT YOUR CODE BELOW THIS LINE

    //adding the user id to localStorage
    localStorage.setItem("user_id",profile_object.user_id);
}


/**
 * A method that shows an error message on the screen
 * @param {object} error_details
 */
function showError(error_details) {
    console.error('----- showError -----', error_details);
    // INSERT YOUR CODE BELOW THIS LINE

    //creating a div with the error message and adding it to the body
    var body = document.body;
    var div = document.createElement('div');
    div.setAttribute('class','error_box');
    div.textContent = "ERROR:"+error_details.error_code+":"+error_details.error_message;

    body.append(div);
}

/////////////////////////////////////////////
//
// TIME UTILITY FUNCTIONS
// These are functions provided to you as a
// courtesy to help with the build process.
//
/////////////////////////////////////////////

/**
 * A utility function that accepts a number of seconds and returns a formatted time with hours minutes and seconds.
 * @param {int} seconds
 * @returns {string} A time in the format of h:mm:ss
 */
function convertSecondsToHoursMinutesSeconds(seconds) {
    let hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600; // remove the hours seconds from the calculations

    let minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60; // remove the hours seconds from the calculations

    return hours + ':' + pad2Digits(minutes) + ":" + pad2Digits(seconds);
}

/**
 * Converts a timestamp integer into a string formatted as YYYY-MM-DD hh:mm:ss
 * @param {int} timestamp
 * @returns {string}
 */
function convertTimestampToDateFormat(timestamp) {
    let d = new Date(parseInt(timestamp));

    return d.getFullYear() + '-' + pad2Digits(d.getMonth() + 1) + '-' + pad2Digits(d.getDate()) +
        ' ' + pad2Digits(d.getHours()) + ':' + pad2Digits(d.getMinutes()) + ':' + pad2Digits(d.getSeconds());

}


/**
 * A function to pad numbers to 2 digits
 * @param number
 * @return {string|*}
 */
function pad2Digits(number) {
    return (number < 10 ? '0' + number : number);
}
