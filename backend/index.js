const express = require("express");
const axios = require("axios");
const { parse } = require("node-html-parser"); // Import node-html-parser
const cors = require("cors");

const app = express();

// Enable CORS to allow requests from the frontend
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/fetch-og", async (req, res) => {
  const { url } = req.query;

  try {
    const formattedUrl =
      url.startsWith("http://") || url.startsWith("https://")
        ? url
        : `https://${url}`;

    const response = await axios.get(formattedUrl);
    const html = response.data;

    // Parse the HTML using node-html-parser
    const root = parse(html);

    // Extract Open Graph metadata (for Facebook, WhatsApp, LinkedIn, etc.)
    const ogTitle =
      root
        .querySelector('meta[property="og:title"]')
        ?.getAttribute("content") ||
      root.querySelector('meta[name="title"]')?.getAttribute("content");
    const ogDescription =
      root
        .querySelector('meta[property="og:description"]')
        ?.getAttribute("content") ||
      root.querySelector('meta[name="description"]')?.getAttribute("content");
    const ogImage = root
      .querySelector('meta[property="og:image"]')
      ?.getAttribute("content");
    const ogUrl =
      root.querySelector('meta[property="og:url"]')?.getAttribute("content") ||
      url;

    // Twitter card metadata
    const twitterTitle = root
      .querySelector('meta[name="twitter:title"]')
      ?.getAttribute("content");
    const twitterDescription = root
      .querySelector('meta[name="twitter:description"]')
      ?.getAttribute("content");
    const twitterImage = root
      .querySelector('meta[name="twitter:image"]')
      ?.getAttribute("content");
    const twitterCard = root
      .querySelector('meta[name="twitter:card"]')
      ?.getAttribute("content");

    // LinkedIn metadata (similar to Open Graph)
    const linkedinTitle = ogTitle;
    const linkedinDescription = ogDescription;
    const linkedinImage = ogImage;

    // Send the metadata back in the response
    res.json({
      og: {
        title: ogTitle,
        description: ogDescription,
        image: ogImage,
        url: ogUrl,
      },
      twitter: {
        title: twitterTitle || ogTitle,
        description: twitterDescription || ogDescription,
        image: twitterImage || ogImage,
        card: twitterCard || "summary_large_image",
      },
      linkedin: {
        title: linkedinTitle,
        description: linkedinDescription,
        image: linkedinImage,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch metadata" });
  }
});

// Start the Express server
app.listen(3000, () => {
  console.log("Proxy server running on port 3000");
});
