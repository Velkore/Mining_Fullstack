/* Goals :
    Table to display requested data
    Search box to search by ore and mine
    Menu to select current available mines
    Edit form for adding / updating mines
    Button to show all mines operated by the company
*/

// Just logging the data coming from the API
$.get('https://mining-web-service.onrender.com/api/mines', (data) => {
    console.log('Mines : ', data)})

$.get('https://mining-web-service.onrender.com/api/ores', (data) => {
    console.log('Ores : ', data)})

$("table").hide()
$("#alertsuccess").hide()
$("#alertfail").hide()
$("#add-mine-form").hide()
$("#add-ore-form").hide()

$('#closealert').click(() => {
    location.reload(true)
})

// Populate table with all mines in database when user clicks on List Mines
$(document).ready(() => {

    $("#listmine").click(() => {

        $("#add-mine-form").hide()
        $("#add-ore-form").hide()
        $("table").show()
    
        // Disgusting hard coding here, to be updated
        $('#th1').empty().html('Mine')
        $('#th2').empty().html('Location')
        $('#th3').empty().html('Ore')
    
        $.get('https://mining-web-service.onrender.com/api/mines', (data) => {
            console.log(data)
    
            // Assign variable to table body
            let $results = $("#output")
            $results.empty()
    
            // For each index in data create a row and data cells
            for (let i = 0; i < data.length; i++) {
                console.log(data[i])
    
                // Create new row and append to table body
                let $newRow = $("<tr></tr>")
                $results.append($newRow)
    
                // Cache current key values
                let mine = data[i].name
                let loc = data[i].location
                let material = data[i].ore
    
                // Create and append data cells to new row
                $('<td></td>').appendTo($newRow).html(mine)
                $('<td></td>').appendTo($newRow).html(loc)
                $('<td></td>').appendTo($newRow).html(material)   
            }
        })
    })
})


// Same as above, but for listing ores
$(document).ready(() => {

    $("#listore").click(() => {

        $("#add-mine-form").hide()
        $("#add-ore-form").hide()
        $("table").show()
    
        $('#th1').empty().html('Ore')
        $('#th2').empty().html('Value')
        $('#th3').empty().html('')
    
        $.get('https://mining-web-service.onrender.com/api/ores', (data) => {
            console.log(data)
    
            let $results = $("#output")
            $results.empty()
    
            for (let i = 0; i < data.length; i++) {
                console.log(data[i])
                let $newRow = $("<tr></tr>")
                $results.append($newRow)
    
                let mine = data[i].name
                let value = data[i].rarity
    
                $('<td></td>').appendTo($newRow).html(mine)
                $('<td></td>').appendTo($newRow).html(value)  
            }
        })
    })
})


// When Add Mine is clicked
$("#addmine").click(() => {
    // Hide table and generate a form for user to generate a POST request to the API
    // Form consists of entering Mine Name, Location, and Material
    $('#mine').empty()
    $('#location').empty()
    $('#material').empty()
    $("table").hide()
    $("#add-ore-form").hide()
    $("#add-mine-form").show()
})

$(document).ready(() => {

    $("#add-mine-form").submit((e) => {
        const form = document.querySelector("#add-mine-form")

        if (!form.checkValidity()) {
            e.preventDefault()
        }

        form.classList.add('was-validated')

        let mine = $('#mine').val()
        let loc = $('#location').val()
        let material = $('#material').val()
        $.post('https://mining-web-service.onrender.com/api/mines', {
            name: `${mine}`,
            location: `${loc}`,
            ore: `${material}`
        }, function(data, status) {
            console.log('STATUS: ' + status + ', DATA: ' + JSON.stringify(data));
        })

        $('#alertsuccess').show()
        return false;
    })
})

$(document).ready(() => {

    $('#searchbtn').click(() => {
        $('table').show()
        let $input = $('#search-input').val()
    })
})

$(document).ready(() => {

    $('#addore').click(() => {
        $("table").hide()
        $("#add-mine-form").hide()
        $("#add-ore-form").show()
        $('#ore').empty()
        $('#value').empty()
        
    })

    $("#add-ore-form").submit((e) => {
        const form = document.querySelector("#add-ore-form")

        if (!form.checkValidity()) {
            e.preventDefault()
        }

        form.classList.add('was-validated')

        let ore = $('#ore').val()
        let val = $('#value').val()
        
        $.post('https://mining-web-service.onrender.com/api/ores', {
            name: `${ore}`,
            rarity: `${val}`
        }, function(data, status) {
            console.log('STATUS: ' + status + ', DATA: ' + JSON.stringify(data));
        })

        $('#alertsuccess').show()
        return false;
    })
})