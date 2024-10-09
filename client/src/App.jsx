import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [url, setUrl] = useState("");
  const [ogData, setOgData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOGData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`http://localhost:3000/fetch-og`, {
        params: { url },
      });

      if (response.data) {
        setOgData(response.data);
      }
    } catch (err) {
      setError("Failed to fetch metadata.");
    }

    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url) {
      fetchOGData();
    }
  };

  return (
    <div style={styles.container}>
      <h1>Social Metadata Fetcher</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Enter website URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Fetch Metadata
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {ogData && (
        <div style={styles.previewContainer}>
          <div style={styles.section}>
            <h3>Facebook / LinkedIn / WhatsApp</h3>
            <img src={ogData.og.image} alt="OG Preview" style={styles.image} />
            <p><strong>Title:</strong> {ogData.og.title}</p>
            <p><strong>Description:</strong> {ogData.og.description}</p>
            <p><strong>URL:</strong> {ogData.og.url}</p>
          </div>

          <div style={styles.section}>
            <h3>Twitter</h3>
            <img src={ogData.twitter.image} alt="Twitter Preview" style={styles.image} />
            <p><strong>Title:</strong> {ogData.twitter.title}</p>
            <p><strong>Description:</strong> {ogData.twitter.description}</p>
            <p><strong>Card Type:</strong> {ogData.twitter.card}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Styling for the component
const styles = {
  container: {
    width: "100%",
    maxWidth: "600px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
  },
  form: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    width: "300px",
  },
  button: {
    padding: "10px",
    marginLeft: "10px",
  },
  previewContainer: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    marginTop: "20px",
    textAlign: "left",
  },
  section: {
    padding: "15px",
  },
  image: {
    width: "100%",
    height: "auto",
    display: "block",
    marginBottom: "10px",
  },
};

export default App;
