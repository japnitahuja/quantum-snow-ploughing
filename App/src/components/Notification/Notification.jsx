import { useEffect, useState } from "react";
import "./Notification.css";

// const style = {
//   position: "absolute",
//   top: "0px",
//   right: "0px",
//   left: "0px",
//   height: "fit-content",
//   padding: "1em",
//   backgroundColor: "red",
//   color: "var(--colour-primary)"
// }

export default function Notification({ message }) {
  const displayPeriod = 5000.0;
  const [showNotification, setShowNotification] = useState(false);

  useEffect(
    () => {
      if (message) {
        setShowNotification(true);
        window.setTimeout(() => setShowNotification(false), displayPeriod);
      }
    },
    [message]
  )

  return (
    <>
      {showNotification &&
        // <div style={style}>
        <div className="Notification_Show">
          {message}
        </div>
      }
    </>);
}