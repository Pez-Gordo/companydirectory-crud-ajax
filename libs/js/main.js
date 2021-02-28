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