const Joi = require('@hapi/joi');
const _ = require('lodash');
const postSchema = require('../models/Post');
const { getNextSequenceValue } = require('../utilites');

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
      let postId = await getNextSequenceValue("postid");
      console.log("Getnextfunction", postId);
    
      const newPost = new postSchema({
        title: title,
        content: content,
        created: new Date(),
        userId: req.user,
        _id: postId
      });
     const isPostSaved = await newPost.save();
     if(isPostSaved) {
       console.log("Post saved status", isPostSaved);
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
if(!req.session.user) {
  res.send({
    status: 0,
    msg: "Not authorised"
  });
}else {
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
     { $project: { _id: 1,  "postTitle": "$title", "postContent": "$content", "userDetails": { "name": { $concat: [ "$user.firstname"," ", "$user.lastname"] }, "gender": { $cond: { if: { $eq: ["$user.gender", "M"]}, then: "male", else: "female"}}, "email": "$user.email"}}}
   ]);
   res.render('allposts/index', {
     posts: (allPostData.length > 0) ? allPostData : []
   })
}

//  if(allPostData) {
//    return res.send({msg: 1, data: allPostData});
//  }else {
//    return res.send({msg: 0, data: {}});
//  }
}


exports.getSinglePost = async (req, res, next) => {
  const postId = req.params.id;

  //find the post with the given postid
  const foundPost = await postSchema.aggregate([ 
    { $match: {_id: parseInt(postId)}},
    { $lookup: {
      from: 'users',
      localField: "userId",
      foreignField: "_id",
      as: "user"
    } },
    { $unwind: "$user"},
    { $project: { _id: 1,  "postTitle": "$title", "postContent": "$content", "userDetails": { "name": { $concat: [ "$user.firstname"," ", "$user.lastname"] }, "gender": { $cond: { if: { $eq: ["$user.gender", "M"]}, then: "male", else: "female"}}, "email": "$user.email"}}}
  ])
  // return res.send({data: foundPost});
  try{
    if(foundPost) {
      res.render('singlepost/index', {
        post: foundPost[0]
      });
      return;
    }
  }catch(error) {
    console.log("Error while fetching data for a single post", error);
  }
}

exports.deletePost = async (req, res, next) => {
  const { postId } = req.body;

  const foundPost = await postSchema.findByIdAndDelete(parseInt(postId));

  try{
    if(foundPost) {
      console.log('Post deleted successfully');
      res.send({status: 1, msg: {}});
    }
  }catch(error) {
    console.log("Error while deleting", error);
  }
  
};