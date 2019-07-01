

exports.savePost = async (req, res, next) => {
  console.log("Request body",req.body);

  const { title, content } = req.body;

  const createPostSchema = Joi.object().keys({
    title: Joi.string().required(),
    content: Joi.string().required()
  });

  const { error, result } = createPostSchema.validate({ title: title, content: content});

  if(_.isNull(error)) {
    try {
      const newPost = new postSchema({
        title: title,
        content: content,
        created: new Date(),
        userId: req.user
      });
     const isPostSaved = await newPost.save();
     if(isPostSaved) {
       res.send({status: 1, msg: {}});
     }
    } catch (error) {
        res.send({status: 0, msg: "Something went wrong", error,});  
    }
  }else {
    res.send({status: 0, msg: {result}});
  }

}