window.addEventListener("scroll", preventMotion, false);
window.addEventListener("touchmove", preventMotion, false);

function preventMotion(event) {
    window.scrollTo(0, 0)
    event.preventDefault()
    event.stopPropagation()
}

let employeeID

let profile = {
    firstName: "",
    lastName: "",
    jobTitle: "",
    email: "",
    department: "",
    location: ""
}

$(document).ready(function() {
    buildTable()
})

function clearTable() {
    $('#database').html(`
    <tbody>
        <tr id="tableHeader">
            <th scope="col" class="hideCell" >ID</th>
            <th scope="col">Display Name</th>
            <th scope="col" class="hideCell" id="jobTitleHeader">Job Title</th>
            <th scope="col" class="hideCell">Email</th>
            <th scope="col" class="hideCell" id="departmentHeader">Department</th>
            <th scope="col" class="hideCell" id="locationHeader">Location</th>
        </tr>
    </tbody>
    `)
}

function appendEntry(db, i, filterBy) {

    $('#database tbody').append(`
        <tr onclick="loadProfile(${JSON.stringify(db[i]).split('"').join("&quot;")})">
            <th class="hideCell">${db[i].id}</th>
            <td><b>${db[i].lastName}</b>, ${db[i].firstName}</td>
            <td class=${(filterBy == "jobTitle") ? "" : "hideCell"}>${db[i].jobTitle}</td>
            <td class="hideCell">${db[i].email}</td>
            <td class=${(filterBy == "department") ? "" : "hideCell"}>${db[i].department}</td>
            <td class=${(filterBy == "location") ? "" : "hideCell"}>${db[i].location}</td>
        </tr>
    `)

}

function buildTable() {
    $.ajax({
        type: 'GET',
        url: 'libs/php/getAll.php',
        dataType: 'json',
        success: function(data) {
            var db = data.data
            var numberOfEntries = 0
            for (let i in db) {
                appendEntry(db, i)
                numberOfEntries++
            }
            $('#numberOfEntries').html(numberOfEntries)
        }
    })
}

function startsWith(db, i, filterBy, searchText) {

    var strLength =  searchText.length;

    if ((db[i][filterBy].toLowerCase()).slice(0, strLength) == searchText.toLowerCase()) {
        appendEntry(db, i, filterBy)
        return 1;
    }
    return 0;
}

function endsWith(db, i, filterBy, searchText) {

    var strLength =  searchText.length;

    if ((db[i][filterBy].toLowerCase()).slice(-strLength) == searchText.toLowerCase()) {
        appendEntry(db, i, filterBy)
        return 1;
    }
    return 0;
}

function contains(db, i, filterBy, searchText) {

    var searchTextArr = searchText.split(' ')

    for (let idx in searchTextArr) {

        if ((db[i][filterBy].toLowerCase()).indexOf(searchTextArr[idx].toLowerCase()) >= 0) {
            appendEntry(db, i, filterBy)
            return 1;
        }
    }
    return 0;
}


function equals(db, i, filterBy, searchText) {

    if (db[i][filterBy].toLowerCase() == searchText.toLowerCase()) {
        appendEntry(db, i, filterBy)
        return 1;
    }
    return 0;
}

function search() {

    clearTable();

    var filterBy = $('.filterSelect:first').val()
    var filterQuery = $('.filterSelect:eq(1)').val()
    var searchText = $('#searchBar').val()

    $.ajax({
        type: 'GET',
        url: 'libs/php/getAll.php', 
        dataType: 'json',
        success: function(data) {

            var db = data.data;

            var numberOfEntries = 0;

            for (let i in db) {

                switch (filterQuery) {
                    case "Starts with":
                        numberOfEntries += startsWith(db, i, filterBy, searchText)
                        break;
                    case "Ends with":
                        numberOfEntries += endsWith(db, i, filterBy, searchText)
                        break;
                    case "Contains":
                        numberOfEntries += contains(db, i, filterBy, searchText)
                        break;
                    case "Equals":
                        numberOfEntries += equals(db, i , filterBy, searchText)
                        break;
                    default:
                        break;
                }
                
            }

            $('#numberOfEntries').html(numberOfEntries)

            if ($('#editModeToggle').prop('checked') == true) {
                editModeOn()
            }
            
            $(`#${filterBy}Header`).removeClass()

        }
    })

}

function reset() {

    $('.filterSelect:first').val("lastName")
    $('.filterSelect:eq(1)').val("Starts with")
    $('#searchBar').val("")
    $('#editModeToggle').prop('checked', false);

    clearTable()
    buildTable()
}

function editModeToggle() {

    if ($('#editModeToggle').prop('checked') == true) {
        $('#adminAuthorization').css('display', 'block')
        editModeOn()
    } else {
        editModeOff()
    }
}

function adminAuthorization() {
    var password = $('#adminPassword').val()
    $('#adminAuthorization').css('display', 'none')

    if (password == "password") {
        $('#editModeToggle').prop('checked', true);
        $('#passwordResponse').text("")
        
    }   else {
        $('#editModeToggle').prop('checked', false);
        $('#passwordResponse').text("Incorrect, Try Again")
        editModeOff()
        
        $('#adminAuthorization').show()
    }
}

function editModeOn() {
    console.log("edit mode on ")
    $('#tableHeader').append('<th onclick="toggleModifyDatabase()"><i class="fas fa-plus-circle fa-lg"></i></th>')
    $('#database').find('tr').each(function(){
        $(this).find('td').eq(4).after(`<td class="deleteEmployee"  onclick="toggleAreYouSure('remove this employee?', 'deleteEmployee()')"><i class="fas fa-minus-circle fa-lg"></i></td>`);
    });    
}


function editModeOff() {

    console.log("edit mode off")
    $('#tableHeader th').last().remove()
    $('#database').find("tr").each(function() {
        $(this).children("td:eq(5)").remove();
    });

}

function loadProfile(profile) {
    $('#profilePage').css("display", "block")

    $('#displayName').children().text(`${profile.firstName}  ${profile.lastName}`)
    $('#id').text(profile.id)
    $('#firstName').text(profile.firstName)
    $('#lastName').text(profile.lastName)
    $('#jobTitle').text(profile.jobTitle)
    $('#email').text(profile.email)
    $('#department').text(profile.department)
    $('#location').text(profile.location)

    if ($('#editModeToggle').prop('checked') == true) {
        updateProfile()
    }
    
}

function returnToTable() {

    $('#profilePage').css("display", "none")
}

function toggleProfileUpdate() {
 
    if ($('#updateButton').text() == "Update") {
        $('#adminAuthorization').css('display', 'block')
        editModeOn()
        updateProfile()

    }   else {  // "Save" button is pressed
        saveProfile()
    }
}


function updateProfile() {

    $('#updateButton').text("Save")

    for (let i = 2; i < 7; i++) {
        let entry = $('#profile').children().eq(i).children().eq(1);
        let entryText = entry.text();
        let id = entry.attr('id')

        profile[id] = entryText;

        if (i < 6) {

            entry.replaceWith(`<input id='${id}' placeholder='${entryText}'>`)

        }   else {

            entry.replaceWith(`<select onchange="updateLocation()" id='${id}'></select>`)

            var category = capitalizeFistLetter(id)
            populateSelectOptions(category, id)

            $(`#${id}`).append(`<option selected="true">${entryText}</option>`)
   
        }

    }

}

function updateLocation() {
    $.getJSON(`libs/php/getAllDepartments.php`, function (departments) {
        let locationID = departments.data.filter(dep => dep.name == $('#department').val())[0].locationID

        $.getJSON(`libs/php/getAllLocations.php`, function (locations) { 
            let location = locations.data.filter(loc => loc.id == locationID)[0].name
            $('#location').text(location)

        })
        
    })

}

function saveProfile() {

    $('#updateButton').text("Update")

    for (let i = 2; i < 7; i++) {
        let entry = $('#profile').children().eq(i).children().eq(1);
        let entryText = entry.val();
        let id = entry.attr('id')

        if (entryText) {
            profile[id] = entryText;
        }

        entry.replaceWith(`<span class='col-7 col-sm-6' id='${id}'>${profile[id]}</span>`)
        
    }

    $('#displayName').children().text(`${profile.firstName} ${profile.lastName}`)

    updateEmployee()

}
