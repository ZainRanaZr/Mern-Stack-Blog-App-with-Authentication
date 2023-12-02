import { useState } from "react";
import styles from "./SubmitBlog.module.css";
import { useSelector } from "react-redux";
import TextInput from "../../components/TextInput/TextInput";
import { submitBlog } from "../../api/internal";
import { useNavigate } from "react-router-dom";

const SubmitBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");

  const author = useSelector((state) => state.user._id);

  const navigate = useNavigate();

  const getImage = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };
  };

  const submitHandler = async () => {
    const data = {
      author: author,
      title: title,
      content: content,
      image: image,
    };
    const response = await submitBlog(data);

    if (response.status === 201) {
      navigate("/blogs");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>Create a Blog</div>
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
        {image !== '' ? <img src={image} width={150} height={150} /> : ''}
      </div>
      <button
        className={styles.submit}
        onClick={submitHandler}
        disabled={title === "" || content === "" || image === ""}
      >
        Submit
      </button>
    </div>
  );
};

export default SubmitBlog;
