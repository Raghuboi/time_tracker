/**
 * A class that handles anything to do with the Projects view
 */
class Projects {

	constructor(api, company_id)
	{
		this.project_form = undefined;

		this.api = api;
		this.company_id = company_id;

		// INSERT YOUR CODE BELOW THIS LINE

		//binding all the methods in the constructor
		this.fillProjectsWithResponse = this.fillProjectsWithResponse.bind(this);
		this.createProjectRow = this.createProjectRow.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.updateFromDelete = this.updateFromDelete.bind(this);
		this.handleFormSubmit = this.handleFormSubmit.bind(this);

		//loading the projects from the API and hiding the from upon initialization
		this.loadProjects();
		this.hideForm();

		//Adding an event listener for the new project button which shows the create form upon success
		let new_project_button = document.getElementById("new_project_button");
		new_project_button.addEventListener("click",this.showCreateForm);

		//adding event listeners for the Submit button
		let submit_button = document.getElementById("submit_button");
		submit_button.addEventListener("click", function(event){event.preventDefault();}); //stops it from refreshing the page
		submit_button.addEventListener("click",this.handleFormSubmit);	//handles the form submission

	}

	/////////////////////////////////////////////
	//
	// PROJECTS
	//
	/////////////////////////////////////////////


	loadProjects()
	{
		console.log('----- loadProjects -----');
		// INSERT YOUR CODE BELOW THIS LINE
		api.makeRequest("GET","companies/64/projects",{}, this.fillProjectsWithResponse.bind(this)); //API Call for getting the list of projects
	}

	fillProjectsWithResponse(xhr_response)
	{
		console.log('----- fillProjectsWithResponse -----', xhr_response);
		// INSERT YOUR CODE BELOW THIS LINE

		for(var object in xhr_response) {
			this.createProjectRow(xhr_response[object]);
		}

	}

	createProjectRow(project)
	{
		console.log('----- createProjectRow -----', project);
		//INSERT YOUR CODE BELOW THIS LINE

		//selecting the table body and row elements
		let tBody= document.querySelector('tbody');
		let tRow= document.createElement('tr');
		//setting each table row's id in the format 'project_x'
		tRow.setAttribute("id","project_"+project.project_id);

		//creating the project id cell and adding it to the row
		let id = document.createElement('td');
		id.textContent = project.project_id;
		tRow.appendChild(id);

		//creating the title cell with link functionality that shows the edit form upon clicking, adding it all to the tRow
		let title = document.createElement('td');
		let titleAnchor = document.createElement('a');
		titleAnchor.setAttribute("class","edit_link");
		titleAnchor.setAttribute("href","#");
		titleAnchor.textContent =  project.title;
		titleAnchor.addEventListener("click",this.showEditForm);
		title.appendChild(titleAnchor);
		tRow.appendChild(title);

		//creating the num_entries cell and adding it to the row
		let entries = document.createElement('td');
		entries.textContent = project.num_entries;
		tRow.appendChild(entries);

		//creating the delete cell with link functionality, adding it to the row
		let del = document.createElement('td');
		let delAnchor = document.createElement('a');
		delAnchor.setAttribute("class","delete_link");
		delAnchor.setAttribute("href","#");
		delAnchor.textContent = "Delete";
		delAnchor.addEventListener("click",this.handleDelete);
		del.appendChild(delAnchor);
		tRow.appendChild(del);

		//adding the row to the table body
		tBody.appendChild(tRow);
	}

	/////////////////////////////////////////////
	//
	// FORMS
	//
	/////////////////////////////////////////////

	showCreateForm(event)
	{
		console.log('----- showCreateForm -----', event);
		// INSERT YOUR CODE BELOW THIS LINE
		document.getElementById("submit_button").setAttribute("value","Create Project");//changing the text value of the submit button
		document.getElementById("form_project_id").removeAttribute("value"); //clearing any value
		document.getElementById("form_project_id").setAttribute("value","0"); //setting the value to 0 in the create form
		document.getElementById("project_form").style.display = "block";
		document.getElementById("title").value = '';//clearing any text in the input text field
	}

	showEditForm(event)
	{
		console.log('----- showEditForm -----', event);
		// INSERT YOUR CODE BELOW THIS LINE
		document.getElementById("submit_button").setAttribute("value","Edit Project"); //changing the text value of the submit button
		let x = event.path[2].getAttribute('id'); //getting the 'project_x' value from the row

		//changing the hidden value to just 'x' by removing 'project_'
		document.getElementById("form_project_id").setAttribute("value",x.substring(8,x.length));
		document.getElementById("project_form").style.display = "block";
		document.getElementById("title").value = event.target.closest('a').textContent; //getting the text in the Title cell of the table row
	}

	hideForm()
	{
		console.log('----- hideForm -----');
		// INSERT YOUR CODE BELOW THIS LINE
		document.getElementById("project_form").style.display = "none"; //hiding the form
	}

	handleFormSubmit(event)
	{
		console.log('----- handleFormSubmit -----', event);
		// INSERT YOUR CODE BELOW THIS LINE
		var x = document.getElementById("title").value; //getting the text in the input field
		var y = document.getElementById("form_project_id").value; //getting the form project id

		// checking if the form is in create or edit mode and updating the table accordingly
		if((y==0)&&(y!=null)) api.makeRequest("POST","projects/",{"title":x},this.createNewProject.bind(this));
		if ((y!=0)&&(y!=null)) api.makeRequest("PATCH","projects/"+y,{"title":x},this.updateProject.bind(this));

	}

	/////////////////////////////////////////////
	//
	// CREATE / EDIT
	//
	/////////////////////////////////////////////

	createNewProject(xhr_response)
	{
		console.log('----- createNewProject -----', xhr_response);
		// INSERT YOUR CODE BELOW THIS LINE

		//creating a new row with data from the parameter
		this.createProjectRow(xhr_response);

		this.hideForm(); //hiding the form after successful updation
	}

	updateProject(xhr_response)
	{
		console.log('----- updateProject -----', xhr_response);
		// INSERT YOUR CODE BELOW THIS LINE

		//selecting the row which needs to be updated
		let project = document.getElementById("project_"+xhr_response.project_id);

		//updating the row with new values
		project.children[0].textContent = xhr_response.project_id;
		project.children[1].children[0].textContent = xhr_response.title;
		project.children[2].textContent = xhr_response.num_entries;

		this.hideForm(); //hiding the form after successful updation
	}

	/////////////////////////////////////////////
	//
	// DELETE
	//
	/////////////////////////////////////////////

	handleDelete(event)
	{
		console.log('----- handleDelete -----', event);
		// INSERT YOUR CODE BELOW THIS LINE

		//getting the id of the row which needs to be deleted
		var x = event.path[2].getAttribute('id');
		//var x = event.target.closest('tr').getAttribute('id'); Alternate method of obtaining project ID.

		api.makeRequest("DELETE","projects/"+x.substring(8,x.length),{}, this.updateFromDelete);
	}

	updateFromDelete(xhr_response)
	{
		console.log('----- updateFromDelete -----', xhr_response);
		// INSERT YOUR CODE BELOW THIS LINE

		//removing the row from the table and updating it
		let row = document.getElementById("project_"+xhr_response.project_id);
		row.remove();
	}



}
