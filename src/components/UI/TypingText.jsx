import { useEffect, useState } from "react";

export default function TypingText({ text, speed = 70, pause = 1300, className = "" }) {
  const [displayed, setDisplayed] = useState("");
  const [dir, setDir] = useState("fwd"); // fwd: typing, bwd: deleting

  useEffect(() => {
    let timeout;
    if (dir === "fwd") {
      if (displayed.length < text.length) {
        timeout = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), speed);
      } else if (displayed.length === text.length) {
        timeout = setTimeout(() => setDir("bwd"), pause);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(text.slice(0, displayed.length - 1)), speed / 2);
      } else if (displayed.length === 0) {
        timeout = setTimeout(() => setDir("fwd"), pause);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, dir, text, speed, pause]);

  return (
    <span className={`${className} whitespace-nowrap relative`}>
      {displayed}
      <span className="animate-blink border-l-2 border-bluegreen ml-1 absolute"></span>
    </span>
  );
}
