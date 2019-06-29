
$('.createPostBtn').on('click', function(e) {
  console.log('creating post');
  const title = $('#postTitle').val();
  const content = $('#postContent').val();

  $.ajax({
    url: `${baseUrl}/post/create`,
    method: 'POST',
    data: {title, content}
  }).done(function(data) {
    console.log(data);
  });

})