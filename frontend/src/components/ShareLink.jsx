function ShareLink({ link }) {
  if (!link) {
    return null;
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
    } catch (error) {
      console.error("Unable to copy link", error);
    }
  };

  return (
    <div className="card">
      <h2>Share this link</h2>
      <div className="share-link-row">
        <input className="share-link-input" value={link} readOnly />
        <button className="secondary-button" type="button" onClick={copyLink}>
          Copy
        </button>
      </div>
    </div>
  );
}

export default ShareLink;
