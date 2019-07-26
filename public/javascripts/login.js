console.log("Login page loaded");


$(".login").on('click', function(e) {
  
  let email = $("#email").val();
  let password = $("#password").val();
  // let confirmpassword = $("#confirmpassword").val();
  // let firstname = $('#firstname').val();
  // let lastname = $("#lastname").val();
  
  $.ajax({
    url: `/login`,
    method: 'POST',
    data: {email, password}
  }).done(function(data) {
    console.log(data);
    if(data.status && data.status == 1) {
      window.location = '/post/create';
    }
  });
});


// function resetPostForm() {
//   $('#email').val('');
//   $('#password').val('');
//   $('#confirmpassword').val('');
//   $('#firstname').val();
//   $('#lastname').val();
// }