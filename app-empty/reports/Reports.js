/**
 * A class that handles anything to do with the Reports view
 */
class Reports {
    constructor(api, company_id) {
            // Must filled via the API calls
            this.projects = undefined;
            this.users = undefined;

            this.api = api;
            this.company_id = company_id;

            // INSERT YOUR CODE BELOW THIS LINE
            this.loadProjects();
            this.loadUsers();

            //updating the table based on the user change
            document.getElementById('user_id').addEventListener('change', event => this.handleUserChange(event));
            document.getElementById('project_id').addEventListener('change', event => this.handleProjectChange(event));
        }
        //private fields to for selected user id, selected project and time entries for later comparision
    _selectedUser = "";
    _selectedProject = "";
    _timeEntries = null;


    /////////////////////////////////////////////
    //
    // PROJECTS
    //
    /////////////////////////////////////////////


    loadProjects() {
        console.log('----- loadProjects -----');
        // INSERT YOUR CODE BELOW THIS LINE
        this.api.makeRequest("GET", "companies/64/projects", {}, this.fillProjectsWithResponse.bind(this));
    }

    fillProjectsWithResponse(xhr_response) {
        console.log('----- fillProjectsWithResponse -----', xhr_response);
        // INSERT YOUR CODE BELOW THIS LINE

        //selecting the project id and creating option value with project id and using title as a text for the option
        let idElement = document.getElementById('project_id');
        for (let id in xhr_response) {
            let createOption = document.createElement("option");
            createOption.value = xhr_response[id].project_id;
            createOption.innerText = xhr_response[id].title;

            idElement.appendChild(createOption);

        }
        //Calling load time entries and filling projects with the response
        this.projects = xhr_response;
        this.loadTimeEntries();
    }


    handleProjectChange(event) {
        console.log('----- handleProjectChange -----', event);
        // INSERT YOUR CODE BELOW THIS LINE
        //adding target value of active project to private selectedProject
        this._selectedProject = event.target.value.toString();
        this.fillTable(this._timeEntries);

    }


    /////////////////////////////////////////////
    //
    // USERS
    //
    /////////////////////////////////////////////

    loadUsers() {
        console.log('----- loadUsers -----');
        // INSERT YOUR CODE BELOW THIS LINE
        this.api.makeRequest("GET", "companies/64/users", {}, this.fillUsersWithResponse.bind(this));

    }

    fillUsersWithResponse(xhr_response) {
        console.log('----- fillUsersWithResponse -----', xhr_response);
        // INSERT YOUR CODE BELOW THIS LINE
        //adding response to the users and created option for the users with value returend as user id
        this.users = xhr_response;

        let idElement = document.getElementById('user_id');
        for (let id in xhr_response) {
            let createOption = document.createElement("option");
            createOption.value = xhr_response[id].user_id;
            createOption.innerText = xhr_response[id].first_name + " " + xhr_response[id].last_name;
            idElement.appendChild(createOption);
        }
        //calling loadTimeEntries()
        this.loadTimeEntries();
    }

    handleUserChange(event) {
        console.log('----- handleUserChange -----', event);
        // INSERT YOUR CODE BELOW THIS LINE
        this._selectedUser = event.target.value.toString();
        this.fillTable(this._timeEntries);
    }

    /////////////////////////////////////////////
    //
    // TIME ENTRIES
    //
    /////////////////////////////////////////////

    loadTimeEntries() {
        console.log('----- loadTimeEntries -----');
        // INSERT YOUR CODE BELOW THIS LINE
        // fill table onces projects and users are filled
        if (this.projects && this.users) {
            //making api call and calling fillTimeEntriesWithResponse by binding it
            this.api.makeRequest("GET", "companies/64/entries", {}, this.fillTimeEntriesWithResponse.bind(this));
        }
    }

    fillTimeEntriesWithResponse(xhr_response) {
            console.log('----- fillTimeEntriesWithResponse -----', xhr_response);
            // INSERT YOUR CODE BELOW THIS LINE
            //setting timeEntries
            this._timeEntries = xhr_response;
            //fills up the table
            this.fillTable(xhr_response);
        }
        /**
         * Has a method to fill up the table also checks the user and project changes and updates by removing and 
         * adding the table rows as needed as per the condition
         * @param {object} entryList is object from the response of api
         * 
         */
    fillTable(entryList) {
        /**
         * Creates table row and adds data using the parameter
         * @param {String} task  is returned by "description" by the response on api call
         * @param {String} project  is returned by "project_id" by the response on api call
         * @param {String} userId  is returned by "user_id" by response on api call
         * @param {String} time  is difference of two time entry start time and end time provided in the response 
         * @param {String} date is returned by "date_added" by the response on api call
         * 
         */
        function addElement(task, project, userId, time, date) {
            //selecting the existing tbody from the document
            const tableBody = document.querySelector('tbody');
            //a new table row element
            const tableRow = document.createElement('tr');

            // fill out table data as a new td 
            const taskElement = document.createElement('td');
            taskElement.innerText = task;
            tableRow.appendChild(taskElement);

            const projectElement = document.createElement('td');
            projectElement.innerText = project;
            tableRow.appendChild(projectElement);

            const userElement = document.createElement('td');
            userElement.innerText = userId;
            tableRow.appendChild(userElement);

            const timeElement = document.createElement('td');
            timeElement.innerText = time;
            tableRow.appendChild(timeElement);

            const datElement = document.createElement('td');
            datElement.innerText = date;
            tableRow.appendChild(datElement);

            //appending rowElement to the the document
            tableBody.appendChild(tableRow);
        }

        // empty table if populated to handle the changes
        // removing all the tds so upon change only new data is shown

        while (document.body.contains(document.querySelector('td'))) {
            let removeElement = document.querySelector('td');
            removeElement.remove();
        }

        for (const entry_id in entryList) {
            const entry = entryList[entry_id];
            let isValid = true;

            //Compares the returned project id and current project, for handling the changes upon true the
            //method to fill up the table is called and the table is filled with the changes project and users data
            if (this._selectedProject && (entry.project_id !== this._selectedProject)) {
                isValid = false;
            }
            if (this._selectedUser && (entry.user_id !== this._selectedUser)) {
                isValid = false;
            }
            if (isValid) {
                //formatting date 
                const date = this.dateString(entry.date_added);
                // calculate time
                //passing start and end time as date object to the method
                const runtime = this.calculateRuntime(new Date(entry.start_time), new Date(entry.end_time));
                //upon valid all the data are added/updated on the table
                addElement(entry.description, entry.project_id, entry.user_id, runtime, date);
            }
        }
    }

    dateString(date) {
            var months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var year = date.substr(0, 4);
            var month = date.substr(5, 2);
            var day = date.substr(8, 2);
            return months[parseInt(month)] + ' ' + day + ', ' + year;
        }
        /**
         * Calculates active or runtime using the start and end time provided on the response, uses Date class of JS for formatting
         * @param {new Date} startTime start time from the response is converted to a new Date so that the calculation can be done
         * @param {new Date} endTime end time from the restponse is convereted to a new Date
         * @returns String formated hours:minutes:seconds
         * Source MDN Date:https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
         * Source (simiar code/implication):https://www.youtube.com/watch?v=_3nkEV6yHtU
         * 
         */
    calculateRuntime(startTime, endTime) {
        //first stores the difference of the two time start and end
        const runtime = new Date(endTime.valueOf() - startTime.valueOf());

        //using .getUTCHours() to calculate hours, all the methods are from the date class
        const hours = runtime.getUTCHours();
        //using .getUTCMinutes() to calculate minutes
        //using ternary condition to add 0 (concatenating) before minutes and seconds if it is less than 10 

        const minutes = runtime.getUTCMinutes() < 10 ? `0${runtime.getUTCMinutes()}` : runtime.getUTCMinutes();
        //using .getUTCSeconds() to calculate seconds
        //using ternary operator to add 0 before minute if it is less than 0

        const seconds = runtime.getUTCSeconds() < 10 ? `0${runtime.getUTCSeconds()}` : runtime.getUTCSeconds();
        return `${hours}:${minutes}:${seconds}`;
    }

}