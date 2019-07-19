console.log("Singup page loaded");


$(".signup").on('click', function(e) {
  
  let email = $("#email").val();
  let password = $("#password").val();
  let confirmpassword = $("#confirmpassword").val();
  let firstname = $('#firstname').val();
  let lastname = $("#lastname").val();
  
  $.ajax({
    url: `/signup`,
    method: 'POST',
    data: {email, password, confirmpassword, firstname, lastname}
  }).done(function(data) {
    console.log(data);
    if(data.status && data.status == 1) {
      resetPostForm();
    }
  });

});


function resetPostForm() {
  $('#email').val('');
  $('#password').val('');
  $('#confirmpassword').val('');
}