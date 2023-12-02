import { useEffect, useState } from "react";
import styles from "./Blog.module.css";
import Loader from "../../components/Loader/Loader";
import { getAllBlog } from "../../api/internal";
import { useNavigate } from "react-router-dom";

const Blog = () => {
  const naviagte = useNavigate();

  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    //IIFE
    (async function getAllBlogsApiCall() {
      const response = await getAllBlog();
      if (response.status === 200) {
        setBlogs(response.data.blogs);
      }
    })();

    //CleanUp
    setBlogs([]);
  }, []);

  if (blogs.length === 0) {
    return <Loader text={"Blogs..."} />;
  }
  return (
    <div className={styles.blogsWrapper}>
      {blogs.map((blog) => (
        <div
          className={styles.blog}
          id={blog._id}
          onClick={() => {
            naviagte(`/blog/${blog._id}`);
          }}
        >
          <h1>{blog.title}</h1>
          <img src={blog.image} alt={blog.title} />
          <p>{blog.content}</p>
        </div>
      ))}
    </div>
  );
};

export default Blog;
