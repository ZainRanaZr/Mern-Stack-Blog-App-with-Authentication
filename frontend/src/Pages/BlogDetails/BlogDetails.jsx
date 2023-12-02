import { useEffect, useState } from "react";
import styles from "./BlogDetails.module.css";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteBlog,
  getBlogById,
  getCommentById,
  postComment,
} from "../../api/internal";
import CommentList from "../../components/CommentList/CommentList";
import Loader from "../../components/Loader/Loader";

const BlogDetails = () => {
  const [blog, setBlog] = useState([]);
  const [comments, setComments] = useState([]);
  const [ownsBlog, setOwnsBlog] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [reload, setReload] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  const blogId = params.id;
  const username = useSelector((state) => state.user.username);
  const userId = useSelector((state) => state.user._id);

  useEffect(() => {
    //IIFE
    (async function getBlogDetails() {
      const commentResponse = await getCommentById(blogId);
      if (commentResponse.status === 200) {
        setComments(commentResponse.data.data);
      }

      const blogResponse = await getBlogById(blogId);
      if (blogResponse.status === 200) {
        // set ownership
        setOwnsBlog(username === blogResponse.data.blog.authorUserName);
        setBlog(blogResponse.data.blog);
      }
    })();

    //CleanUp
  }, [reload]);

  const postCommentHandler = async () => {
    const data = {
      author: userId,
      blog: blogId,
      content: newComment,
    };

    const response = await postComment(data);
    if (response.status == 201) {
      setNewComment("");
      setReload(!reload);
    }
  };

  const deleteBlogHandler = async () => {
    const response = await deleteBlog(blogId);
    if (response.status === 200) {
      navigate("/blogs");
    }
  };

  if (blog.length === 0) {
    <Loader text={"blog detail..."} />;
  }
  return (
    <div className={styles.detailsWrapper}>
      <div className={styles.left}>
        <h1 className={styles.title}>{blog.title}</h1>
        <div className={styles.meta}>
          <p>@{blog.authorFirstName + ' ' + blog.authorLastName + " on " + new Date(blog.createdAt).toDateString()}</p>
        </div>
        <div className={styles.image}>
          <img src={blog.image} alt={blog.title} width={250} height={250} />
        </div>
        <p className={styles.content}>{blog.content}</p>
        {ownsBlog && (
          <div className={styles.controls}>
            <button className={styles.editButton} onClick={() => {navigate(`/blog-update/${blog._id}`)}}>
              Edit
            </button>
            <button className={styles.deleteButton} onClick={deleteBlogHandler}>
              Delete
            </button>
          </div>
        )}
      </div>
      <div className={styles.right}>
        <div className={styles.commentsWrapper}>
          <CommentList comments={comments} />
          <div className={styles.postComment}>
            <input
              className={styles.input}
              type="text"
              placeholder="comment goes here.."
              value={newComment}
              onChange={(e) => {
                setNewComment(e.target.value);
              }}
            />
            <button
              className={styles.postCommentButton}
              onClick={postCommentHandler}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
