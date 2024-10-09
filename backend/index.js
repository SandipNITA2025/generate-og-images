const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors"); // To enable CORS
const app = express();

// Enable CORS to allow requests from the frontend
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/fetch-og", async (req, res) => {
  const { url } = req.query;

  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    // Extract Open Graph metadata (for Facebook, WhatsApp, LinkedIn, etc.)
    const ogTitle = $('meta[property="og:title"]').attr("content") || $('meta[name="title"]').attr("content");
    const ogDescription = $('meta[property="og:description"]').attr("content") || $('meta[name="description"]').attr("content");
    const ogImage = $('meta[property="og:image"]').attr("content");
    const ogUrl = $('meta[property="og:url"]').attr("content") || url;

    // Twitter card metadata
    const twitterTitle = $('meta[name="twitter:title"]').attr("content");
    const twitterDescription = $('meta[name="twitter:description"]').attr("content");
    const twitterImage = $('meta[name="twitter:image"]').attr("content");
    const twitterCard = $('meta[name="twitter:card"]').attr("content");

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
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch metadata" });
  }
});

// Start the Express server
app.listen(3000, () => {
  console.log("Proxy server running on port 3000");
});
