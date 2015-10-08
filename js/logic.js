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
    var red = document.getElementById('red_input').value;
    var green = document.getElementById('green_input').value;
    var blue = document.getElementById('blue_input').value;
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

function calculate_score() {
    var answer = get_answer();
    var guess = get_guess();
    var diff = compare_arrays(answer, guess)
    if (diff < 100) {
        return 1
    }
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
    if (win && FLAG === 0) {
        $('.message').text("You got it!")
        SCORE += 1
        FLAG = 1;
    }

    else if (win && FLAG === 1){
        $('.message').text("Go to next color!")
    }
    else {
         $('.message').text("Nope! Try another color!")
    }
    $('.score').text("Score: " + SCORE.toString())
    console.log(win)

})

$('#next-color-button').on('click', function(){
    $('.bg').css('background-color', gen_background())
    $('.message').text("")
    FLAG = 0;
})