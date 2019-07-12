$('.delete-post').on('click', function() {
 var singlePostBlock =  $(this).closest('.singlepost-block');
 var postId = singlePostBlock.attr('id');
  $.ajax({
    url: `${baseUrl}/post/delete`,
    method: 'POST',
    data: {postId, }
  }).done(function(data) {
    console.log(data);
    if(data.status && data.status == 1) {
      window.location.href = "/post/all";
    }
  });
});