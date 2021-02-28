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