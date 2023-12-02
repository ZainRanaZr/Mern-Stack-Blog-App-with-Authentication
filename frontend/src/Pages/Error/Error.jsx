import { Link } from "react-router-dom";
import styles from "./Error.module.css";

const Error = () => {
  return (
    <div className={styles.errorWrapper}>
      <div className={styles.errorHeader}>Error 404 - Page not found</div>
      <div className={styles.errorBody}>
        Go back to <Link to="/" className={styles.errorLink}>Home</Link>
      </div>
    </div>
  );
};

export default Error;
