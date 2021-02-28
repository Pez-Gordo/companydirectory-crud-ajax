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

