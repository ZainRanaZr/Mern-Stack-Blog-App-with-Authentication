const Joi = require("joi");
const fs = require("fs");
const Blog = require("../models/blog");
const { BACKEND_SERVER_PATH } = require("../config/index");
const BlogDetailDTO = require("../dto/blog-detail");
const BlogDTO = require("../dto/blog");
const Comment = require("../models/comment");

const mongodbIdPattren = /^[0-9a-fA-F]{24}$/;

const blogController = {
  async createBlog(req, res, next) {
    // 1: validate Body
    const createBlogSchema = Joi.object({
      title: Joi.string().required(),
      content: Joi.string().required(),
      image: Joi.string().required(),
      author: Joi.string().regex(mongodbIdPattren).required(),
    });

    const { error } = createBlogSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { title, content, image, author } = req.body;

    // 2: Handle Feature Image storage, naming
    // client side -> base64 encoded string -> decoded -> store -> save path to Db
    // read node.js buffer
    const buffer = Buffer.from(
      image.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
      "base64"
    );
    // allocate a random name
    const imagePath = `${Date.now()}-${author}.png`;
    // save locally
    try {
      fs.writeFileSync(`storage/${imagePath}`, buffer);
    } catch (error) {
      return next(error);
    }

    // 3: save Blog to Db
    let newBlog;
    try {
      newBlog = new Blog({
        title,
        content,
        author,
        image: `${BACKEND_SERVER_PATH}/storage/${imagePath}`,
      });

      await newBlog.save();
    } catch (error) {}

    // 4: return Response
    const blogDto = new BlogDTO(newBlog);
    res.status(201).json({ blog: blogDto });
  },
  async getBlogAll(req, res, next) {
    try {
      const blogs = await Blog.find({});

      const blogsDto = [];

      for (let i = 0; i < blogs.length; i++) {
        const dto = new BlogDTO(blogs[i]);
        blogsDto.push(dto);
      }

      return res.status(200).json({ blogs: blogsDto });
    } catch (error) {
      return next(error);
    }
  },
  async getBlogById(req, res, next) {
    // 1: validate Id
    const getBlogByIdSchema = Joi.object({
      id: Joi.string().regex(mongodbIdPattren).required(),
    });
    const { error } = getBlogByIdSchema.validate(req.params);
    if (error) {
      return next(error);
    }

    // 3: if valid the fetch blog
    let blog;
    const { id } = req.params;
    try {
      blog = await Blog.findOne({ _id: id }).populate("author");
    } catch (error) {
      return next(error);
    }
    const blogDetailDto = new BlogDetailDTO(blog);
    // 2: response
    return res.status(200).json({ blog: blogDetailDto });
    // return res.status(200).json({blog: blog});
  },
  async updateBlog(req, res, next) {
    // 1: validate
    const updateBlogSchema = Joi.object({
      title: Joi.string().required(),
      content: Joi.string().required(),
      author: Joi.string().regex(mongodbIdPattren).required(),
      blogId: Joi.string().regex(mongodbIdPattren).required(),
      image: Joi.string(),
    });

    const { error } = updateBlogSchema.validate(req.body);

    const { title, content, author, blogId, image } = req.body;

    // if image is edited then delete previous image
    let blog;
    try {
      blog = await Blog.findOne({ _id: blogId });
    } catch (error) {
      return next(error);
    }

    if (image) {
      let previousImage = blog.image;
      previousImage = previousImage.split("/").at(-1); // asdas123-123ea.png

      // delete image
      fs.unlinkSync(`storage/${previousImage}`);

      // save new image
      // read node.js buffer
      const buffer = Buffer.from(
        image.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
        "base64"
      );
      // allocate a random name
      const imagePath = `${Date.now()}-${author}.png`;
      // save locally
      try {
        fs.writeFileSync(`storage/${imagePath}`, buffer);
      } catch (error) {
        return next(error);
      }

      await Blog.updateOne(
        { _id: blogId },
        {
          title,
          content,
          image: `${BACKEND_SERVER_PATH}/storage/${imagePath}`,
        }
      );
    } else {
      await Blog.updateOne(
        { _id: blogId },
        {
          title,
          content,
        }
      );
    }

    // send response
    return res.status(200).json({ message: "Blog Updated Successfully" });
  },
  async deleteBlogById(req, res, next) {
    // 1: validate id
    const deleteBlogSchema = Joi.object({
      id: Joi.string().regex(mongodbIdPattren).required(),
    });

    const { error } = deleteBlogSchema.validate(req.params);

    const { id } = req.params;

    // 2: delete Blog
    try {
      // Delete Blog by Id
      await Blog.deleteOne({ _id: id });
      // 3: delete comments of blog
      //Delete All Comment By Blog Id
      await Comment.deleteMany({ blog: id });
    } catch (error) {
      return next(error);
    }

    // 4: Return Response
    return res
      .status(200)
      .json({ message: "Blog and Comment Deleted Successfully" });
  },
};

module.exports = blogController;
