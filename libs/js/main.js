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