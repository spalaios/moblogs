const Joi = require('@hapi/joi');
const postSchema = require('../models/Post');
const _ = require('lodash');

exports.savePost = async (req, res, next) => {
  // console.log("Request body",req.body);

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

exports.getAllPosts = async (req, res, next) => {
  //aggregate all the posts and project it certain way and send it
  //try sending data in these styles
  //1. via normal find and project 
  //2. via aggregation
  //3. via lookup - learn about it
  //4. via populate and aggregte it
postSchema.find({}).populate('userId');
const allPostData =  await postSchema.aggregate([ 
   { $match: {}},
   { $lookup: {
     from: 'users',
     localField: "userId",
     foreignField: "_id",
     as: "user"
   } },
   { $unwind: "$user"},
   { $project: { _id: 0,  "postTitle": "$title", "postContent": "$content", user: 1}}
 ]);

 if(allPostData) {
   return res.send({msg: 1, data: allPostData});
 }else {
   return res.send({msg: 0, data: {}});
 }
}