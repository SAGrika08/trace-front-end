import styles from "./Loading.module.css";
import LoadingIcon from "../../assets/images/loading.svg";

const Loading = ({ text = "Loading…", variant = "page" }) => {
  return (
    <div className={`${styles.container} ${variant === "inline" ? styles.inline : ""}`}>
      <img src={LoadingIcon} alt="Loading…" className={styles.loadingImage} />
      {text && <p className={styles.loadingText}>{text}</p>}
    </div>
  );
};

export default Loading;
