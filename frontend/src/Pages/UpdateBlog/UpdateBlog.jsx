import { useEffect, useState } from "react";
import styles from "./UpdateBlog.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { getBlogById, updateBlog } from "../../api/internal";
import TextInput from "../../components/TextInput/TextInput";
import { useSelector } from "react-redux";

const UpdateBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");

  const params = useParams();
  const blogId = params.id;

  const navigate = useNavigate();
  const getImage = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };
  };
  useEffect(() => {
    //IIFE
    (async function getBlogDetails() {
      const response = await getBlogById(blogId);
      if (response.status === 200) {
        setTitle(response.data.blog.title);
        setContent(response.data.blog.content);
        setImage(response.data.blog.image);
      }
    })();

    //CleanUp
  }, []);

  const author = useSelector((state) => state.user._id);

  const updateHandler = async () => {
    // http:backend_server:port/storage/file.png
    // base64
    let data;
    if (image.includes("http")) {
      data = {
        author: author,
        title: title,
        content: content,
        blogId: blogId,
      };
    } else {
      data = {
        author: author,
        title: title,
        content: content,
        image: image,
        blogId: blogId,
      };
    }
    const response = await updateBlog(data);

    if (response.status === 200) {
      navigate("/blogs");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>Edit a Blog</div>
      <TextInput
        type="text"
        name="title"
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "60%" }}
      />
      <textarea
        className={styles.content}
        name="content"
        placeholder="content"
        value={content}
        // maxLength={400}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
      <div className={styles.imagePrompt}>
        <p>Choose a feature image</p>
        <input
          type="file"
          name="image"
          id="image"
          accept="image/jpg, image/jpeg, image/png"
          onChange={getImage}
        />
        <img src={image} width={150} height={150} />
      </div>
      <button
        className={styles.update}
        onClick={updateHandler}
        disabled={title === "" || content === ""}
      >
        Update
      </button>
    </div>
  );
};

export default UpdateBlog;
