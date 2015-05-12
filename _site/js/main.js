(function(){

//logic for make the modal window for signing up appear
var signUp = $('.js-sign-up');
var modal = $('.modal--signup');
var overlay = $('.overlay');

signUp.on('click', function(e){
	e.preventDefault();

	modal.addClass('open');
});

overlay.on('click', function(e){
	if (modal.hasClass('open')) {
		modal.removeClass('open');
	}
});

//logic for handling a signup

var signUpForm = $('.js-signup-form');

signUpForm.on('submit', function(e){
	e.preventDefault();
	
	var username = $('.js-form-username').val();
	var email= $('.js-form-email').val();
	var password = $('.js-form-password').val();
	var firstname = $('.js-form-firstname').val();
	var lastname = $('.js-form-lastname').val();

	var data = {
		username: username,
		firstName: firstname,
		lastName: lastname,
		email: email,
		password: password
	}

	var formdata = JSON.stringify(data);

	ajax.post('http://getbraid.io/api/mangement/v1/user', formdata, function(status, res){
		var data = JSON.parse(res);
		if (status == 201) {
			//succesfully created the user
			$('.js-message').text(data.message);
			$('.message-bar').addClass('show message-success');

			//set a timeout and hide the bar afterwards
			setTimeout(function(){
				$('.message-bar').removeClass('show message-success');
				window.location = 'http://getbraid.io/login';
			},3000);
		} else if (status == 200) {
			//the request was okay but it's a warning, probbaly username is taken
			$('.js-message').text(data.message);
			$('.message-bar').addClass('show message-warning');

			//set a timeout and hide the bar afterwards
			setTimeout(function(){
				$('.message-bar').removeClass('show message-warning');
			},5000);
		} else if ( status == 404) {
			//Something went wrong show the message to the message bar
			$('.js-message').text(data.message);
			$('.message-bar').addClass('show message-error');

			//set a timeout and hide the bar afterwards
			setTimeout(function(){
				$('.message-bar').removeClass('show message-error');
			},5000);
		}
	});
});



})();