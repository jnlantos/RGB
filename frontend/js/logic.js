var SCORE = 0;

$('#replay-button').hide()
$('#high-scores').hide()
$('.input-nickname').hide()
$('#submit-nickname').hide()

function get_answer() {
    var str = $('.circle').css('background-color');
    str = str.split('(');
    str = str[1].split(',')
    var red = str[0];
    var green = str[1].trim();
    var blue = str[2].split(')')
    blue = blue[0].trim();
    console.log([parseInt(red), parseInt(green), parseInt(blue)])
    return [parseInt(red), parseInt(green), parseInt(blue)]
}

function get_guess() {
    var red = $('#red_input').val();
    var green = $('#green_input').val();
    var blue = $('#blue_input').val();
    console.log("Get guess output: " + [parseInt(red.trim()), parseInt(green.trim()), parseInt(blue.trim())])
    return [parseInt(red.trim()), parseInt(green.trim()), parseInt(blue.trim())]
}

function compare_arrays(array1, array2) {
    if (array1.length !== array2.length){
        throw "What have you done!?!?"
    }

    var diff = 0;
    for (i = 0; i < array1.length; i++) {
        diff += Math.abs(array1[i] - array2[i])
        }
    return diff
    }

// score is based on a continuum.
// The smaller the diff, the better the guess,
// so the smaller the diff, the higher the score.
// The total score you can get each time is 255 * 3,
// in which case the diff was 0 for each colour.
// scaled out of 100.
function calculate_score() {
    var answer = get_answer();
    var guess = get_guess();
    var diff = compare_arrays(answer, guess)
    return Math.floor(((((255 * 3) - diff) / (255 * 3)) * 100))
}

// I think houssam mentioned that we should use classes instead of ids whenever possible -style -get him to code review. :TODO
$('#play-button').on('click', function(){
    window.location = "play.html";
});

function gen_random_number() {
    return  Math.floor(Math.random() * (255))
}

function gen_background() {
    var red = gen_random_number()
    var green = gen_random_number()
    var blue = gen_random_number()
    return 'rgb(' + red.toString() + ',' + green.toString() + ',' + blue.toString() + ')'
}

function validate_form(){
    var inputs = get_guess()
    console.log("inputs: " + inputs)
    for (i = 0; i < inputs.length; i++) {
        if (inputs[i] > 256 || inputs[i] < 0) {
            return false
        }
        else if (isNaN(inputs[i])) {
            return false
        }
    }
    return true
}


function getHighScores(){
    $.ajax({
        url: "http://localhost:3000/scores",
        type: "GET",
        dataType: "json",
        
        success: function( json ){
            $("#high-scores").text(JSON.stringify(json))
        },

        error: function(xhr, status, errorThrown){
            console.log("Error: " + errorThrown)
            console.log("Status: " + status)
            console.dir(xhr)    
        },

    })
}

function postHighScore(){
    $.ajax({
        url: "http://localhost:3000/scores",
        type: "POST",
        dataType: "json",

        data: {
            'username':$('#nickname').val(),
            'score': SCORE },
        
        success: function( json ){
            console.log("Nickname and highscore submitted!")
        },

        error: function(xhr, status, errorThrown){
            console.log("Error: " + errorThrown)
            console.log("Status: " + status)
            console.dir(xhr)    
        },
    })
}



// Question: how come when we change to seconds shit breaks?
var time = 100;
var duration = moment.duration(time * 1000, 'milliseconds');
var interval = 1000;
var timeout = new Event('zero');

//Why do event listeners need anonomous functions?
document.addEventListener('zero', function(){
    $('.score').hide()
    $('.countdown').hide()
    $('.circle').hide()
    $('.input').hide()
    $('#submit-button').hide()
    $('.message').hide()
    $('.gameover-message').html('GAME OVER!' + '<br><br>' + 'Score: ' + SCORE.toString())
    $('.input-nickname').show()
    $('#submit-nickname').show()

});


setInterval(function(){
    if ($('.countdown').text() === '0:00'){
        document.dispatchEvent(timeout)
    }
    else {
        duration = moment.duration(duration.asMilliseconds() - interval, 'milliseconds');
        //show how many hours, minutes and seconds are left
        $('.countdown').text(moment(duration.asMilliseconds()).format('m:ss'));
    }

}, interval);

var showhighscores = new Event('showhighscores');

document.addEventListener('showhighscores', function(){
    $('.score').hide()
    $('.countdown').hide()
    $('.circle').hide()
    $('.input').hide()
    $('#submit-button').hide()
    $('.message').hide()
    $('#submit-nickname').hide()
    $('.input-nickname').hide()
    $('#replay-button').show()
    $('#high-scores').show()
});

//when do we need document.ready() wrapped around this? :TODO
$('.circle').css('background-color', gen_background())

$('#submit-button').on('click', function() {
    var valid = validate_form()
    console.log(valid)
    if (valid) {
        var win = calculate_score();
        $('.message').text("You got " + win.toString() + " points!")
        SCORE += win

        $('.circle').css('background-color', gen_background())
        $('.score').text("Score: " + SCORE.toString())
        console.log(win)
        console.log(SCORE)
    }
    else {
        $('.message').text("Form not valid!")
    }
})

$('#replay-button').on('click', function() {
   window.location.href = 'play.html'
})

$('#submit-nickname').on('click', function() {
    postHighScore()
    $('#submit-nickname').hide()
    $('.input-nickname').hide()
    getHighScores()
   
    document.removeEventListener('zero', timeout)
    document.dispatchEvent(showhighscores)
})
