const Joi = require("joi");
const Comment = require("../models/comment");
const CommentDTO = require("../dto/comment");

const mongodbIdPattren = /^[0-9a-fA-F]{24}$/;

const commentController = {
  async createComment(req, res, next) {
    const createCommentSchema = Joi.object({
      content: Joi.string().required(),
      blog: Joi.string().regex(mongodbIdPattren).required(),
      author: Joi.string().regex(mongodbIdPattren).required(),
    });

    const { error } = createCommentSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { content, author, blog } = req.body;

    try {
      const newComment = new Comment({
        content,
        author,
        blog,
      });
      await newComment.save();
    } catch (error) {
      return next(error);
    }

    // Return response
    return res.status(201).json({ message: "Comment created!" });
  },
  async getCommentById(req, res, next) {
    const getCommentByIdSchema = Joi.object({
      id: Joi.string().regex(mongodbIdPattren).required(),
    });

    const { error } = getCommentByIdSchema.validate(req.params);
    if (error) {
      return next(error);
    }

    const { id } = req.params;

    let comments;
    try {
      comments = await Comment.find({ blog: id }).populate("author");
    } catch (error) {
      return next(error);
    }

    let commentDto = [];
    for (let i = 0; i < comments.length; i++) {
      const obj = new CommentDTO(comments[i]);
      commentDto.push(obj);
    }

    // return response
    return res.status(200).json({ data: commentDto });
  },
  // async createComment (req, res, next) {},
};

module.exports = commentController;
