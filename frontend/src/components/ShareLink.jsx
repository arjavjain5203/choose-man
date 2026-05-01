import { useEffect, useRef, useState } from "react";

function ShareLink({ link }) {
  const [copied, setCopied] = useState(false);
  const resetTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setCopied(false);

    if (resetTimerRef.current) {
      window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
  }, [link]);

  if (!link) {
    return null;
  }

  const handleCopy = async () => {
    if (!link) {
      return;
    }

    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);

      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
      }

      resetTimerRef.current = window.setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
      console.error("Unable to copy link", error);
    }
  };

  return (
    <div className="card">
      <h2>Share this link</h2>
      <div className="share-link-row">
        <input className="share-link-input" value={link} readOnly />
        <button className={`copy-btn ${copied ? "copied" : ""}`} type="button" onClick={handleCopy}>
          {copied ? "Copied!" : "Copy Link"}
        </button>
      </div>
    </div>
  );
}

export default ShareLink;
