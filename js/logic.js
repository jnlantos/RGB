var SCORE = 0;
var FLAG = 0;

function get_answer() {
    var str = $('body').css('background');
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
    console.log([parseInt(red.trim()), parseInt(green.trim()), parseInt(blue.trim())])
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

function gen_background(){
    var red = gen_random_number()
    var green = gen_random_number()
    var blue = gen_random_number()
    return 'rgb(' + red.toString() + ',' + green.toString() + ',' + blue.toString() + ')'
}

//when do we need document.ready() wrapped around this? :TODO
$('.bg').css('background-color', gen_background())

$('#submit-button').on('click', function() {
    var win = calculate_score();
    $('.message').text("You got " + win.toString() + " points!")
    SCORE += win
    $('.bg').css('background-color', gen_background())

    $('.score').text("Score: " + SCORE.toString())
    console.log(win)

})