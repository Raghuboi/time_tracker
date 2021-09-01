/**
 * A class that handles anything to do with the Reports view
 */
class Track
{

	constructor(api, company_id)
	{
		this.start_button = undefined;
		this.stop_button = undefined;
		this.track_form = undefined;

		
		

		// Update the timer immediately, then trigger the callback every second to update the clock
		this.updateTimer();
		setInterval(this.updateTimer,1000);

		this.api = api;
		this.company_id = company_id;

		
		// INSERT YOUR CODE BELOW THIS LINE

		this.signal = 0; // sets start/stop  signal
		this.loadProjects();

	
		document.getElementById("start_button").addEventListener("click", this.start); 
		document.getElementById("stop_button").addEventListener("click", this.stop);

		//stores project ID to local Storage
		this.entryProjectID;
document.getElementById("project_id").addEventListener("change", function() {
		
		this.entryProjectID = this.value
		localStorage.setItem("entryProjectID", this.entryProjectID );
	});

		
		  //stores project description to local Storage
		  
		  document.getElementById("description").addEventListener("input", function() {
			localStorage.setItem("entryDescription", document.getElementById("description").value)});


			this.api.makeRequest('GET','acs/profile', {}, getUserID); // makes request to get userId

			
			/**
			 *  This method sets the user id gotten from the api request
			 * @param {object} object the used in getting the user_id.
			 */
			 
			 function getUserID(object)
			{
				localStorage.setItem("user_id", object.user_id);
			}


	  //hide start and stop buttons
	  document.getElementById("start_button").addEventListener("click", toggleStart);
	  document.getElementById("start_button").addEventListener("click", toggleStop);

	}


	/**
			 *  This method keeps the timer in sync with the current time
			 * 
			 */


	updateTimer()
	{
		//console.log('----- updateTimer -----'); // disabled. too noisy
		// INSERT YOUR CODE BELOW THIS LINE

	
		let signal = parseInt(localStorage.getItem("signal")); // gets start/ stop signal
		if (signal ==1)
		{ 

				
			//compare start time with current time
			
			let startStamp = localStorage.getItem("timer_timestamp")
				var d = new Date();
				let currentStamp = d.getTime();

				let timeDiff = (currentStamp - startStamp)/1000;
		 
			
				//convert time after comparisoh
				let tHours = parseInt(timeDiff/3600);
				let tMinutes = parseInt((timeDiff%3600)/60);
				let tSeconds = parseInt((timeDiff%3600)%60);
		
		
		// Properly format time
		
		let hoursConfig = "";
		let minutesConfig = "";
		let secondsConfig = "";

		
		if(tHours<10)
		{ hoursConfig ="0";
		}

		if(tMinutes<10)
		{ minutesConfig ="0";
		}

		if(tSeconds<10)
		{ secondsConfig ="0";
		}

				document.getElementById("counter").innerText = hoursConfig + tHours+ ":" + minutesConfig + tMinutes+":"+secondsConfig + tSeconds;

			

		}
		


	}

	/////////////////////////////////////////////
	//
	// EVENTS
	//
	/////////////////////////////////////////////

	/**
			 *  This method starts the timer
			 * @param {event} //not used 
			 */



	start(event)
	{
		console.log('----- start -----', event, Date.now());
		// INSERT YOUR CODE BELOW THIS LINE

		this.signal = 1; //sets start/ stop signal

	

		//properly formats date
		
		var d = new Date(); 

		let month = d.getMonth();
		let day = d.getDate();
		let hours = d.getHours();
		let minutes = d.getMinutes();
		let seconds = d.getSeconds();

		let monthConfig = "";
		let dayConfig = "";
		let hoursConfig = "";
		let minutesConfig = "";
		let secondsConfig = "";

		if(month<10)
		{ monthConfig ="0";
		}

		if(day<10)
		{ dayConfig ="0";
		}

		if(hours<10)
		{ hoursConfig ="0";
		}

		if(minutes<10)
		{ minutesConfig ="0";
		}

		if(seconds<10)
		{ secondsConfig ="0";
		}

let startDate = d.getFullYear() + "-" +  monthConfig + d.getMonth() + "-"+ dayConfig +  d.getDate() + " " + hoursConfig + d.getHours()  + ":" + minutesConfig + d.getMinutes() + ":" + secondsConfig + d.getSeconds();
		

localStorage.setItem("timer_timestamp", d.getTime());
		localStorage.setItem("start_time", startDate);
		localStorage.setItem("signal", '1'); // sets start signal
		let counterDiv = document.getElementById("counter"); // gets counter element
		
		counterDiv.innerText = "00:00:00"; // sets the inner text of the counter element
}

/**
*  This method stops the timer and updates the api
* @param {event} //not used 
*/

	stop(event)
	{
		console.log('----- stop -----', event);
		// INSERT YOUR CODE BELOW THIS LINE

		
		//properly formats date
		var d = new Date(); // for now

		let month = d.getMonth();
		let day = d.getDate();
		let hours = d.getHours();
		let minutes = d.getMinutes();
		let seconds = d.getSeconds();

		let monthConfig = "";
		let dayConfig = "";
		let hoursConfig = "";
		let minutesConfig = "";
		let secondsConfig = "";

		if(month<10)
		{ monthConfig ="0";
		}

		if(day<10)
		{ dayConfig ="0";
		}

		if(hours<10)
		{ hoursConfig ="0";
		}

		if(minutes<10)
		{ minutesConfig ="0";
		}

		if(seconds<10)
		{ secondsConfig ="0";
		}

		let timer_timestamp = d.getFullYear() + "-" +  monthConfig + d.getMonth() + "-"+ dayConfig +  d.getDate() + " " + hoursConfig + d.getHours()  + ":" + minutesConfig + d.getMinutes() + ":" + secondsConfig + d.getSeconds();
		
localStorage.setItem("signal", '0'); // sets stop signal

		let description = localStorage.getItem("entryDescription");
		let project_id = parseInt(localStorage.getItem("entryProjectID"));
		let start_time = localStorage.getItem('start_time');
		let end_time= timer_timestamp;

		let user_id = parseInt(localStorage.getItem('user_id'));

api.makeRequest("POST", "projects/entries", {description,project_id,user_id,start_time,end_time}, document.getElementById("counter").innerText = "00:00:00"); // makes a post request to post the parameters to the api

}


	/////////////////////////////////////////////
	//
	// PROJECTS
	//
	/////////////////////////////////////////////


	/**
	*  This method makes a request to the api to get projects
	* 
	*/
	
	loadProjects()
	{
		console.log('----- loadProjects -----');
		// INSERT YOUR CODE BELOW THIS LINE

		this.api.makeRequest("GET", "companies/64/projects", {}, this.fillProjectsWithResponse);// sends GET request via api
		
	}


	/**
	*  This method makes a request to the api to get projects
	* @param {xhr_response} xhr_response return json file from api request from loadProject()
	*/

	fillProjectsWithResponse(xhr_response)
	{
		console.log('----- fillProjectsWithResponse -----', xhr_response);
		// INSERT YOUR CODE BELOW THIS LINE
	
		let selectProject = document.getElementById('project_id'); // gets select element by Id and assigns it to a var

		for (let i in xhr_response) 
		{
            let newOption = document.createElement("option");
            newOption.value = xhr_response[i].project_id;
            newOption.innerText = xhr_response[i].title;
			selectProject.appendChild(newOption);
			
        }
	}
}






/**
	*  This method toggles start button display to hidden
	* 
	*/


function toggleStart() 
{

	document.getElementById("start_button").classList.toggle("start");

}

/**
	*  This method toggles stop button display to hidden
	* 
	*/

function toggleStop()
{

document.getElementById("stop_button").classList.toggle("stop");

}