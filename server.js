const express = require("express");
const path = require("path");
const { OpenAI } = require("openai");
require("dotenv").config();
const app = express();

// Set the port based on environment variable or default to 3000
const PORT = process.env.PORT || 3000;

// Log environment variables (without exposing the full API key)
console.log("Environment variables loaded:");
console.log(
  "NVIDIA_API_KEY:",
  process.env.NVIDIA_API_KEY ? "Present" : "Missing"
);
if (process.env.NVIDIA_API_KEY) {
  console.log(
    "API Key format:",
    process.env.NVIDIA_API_KEY.substring(0, 10) + "..."
  );
}

// Initialize OpenAI with NVIDIA API
const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the src directory
app.use(express.static(path.join(__dirname, "src")));

// Test endpoint to verify API connection
app.get("/api/test", async (req, res) => {
  try {
    console.log("Testing API connection...");
    console.log("API Key:", process.env.NVIDIA_API_KEY ? "Present" : "Missing");
    console.log("Base URL:", "https://integrate.api.nvidia.com/v1");

    const completion = await openai.chat.completions.create({
      model: "nvidia/llama-3.1-nemotron-70b-instruct",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content:
            "Hello, this is a test message. Please respond with 'API connection successful!'",
        },
      ],
      temperature: 0.7,
      max_tokens: 50,
    });

    const response = completion.choices[0]?.message?.content || "No response";
    console.log("API Response:", response);

    res.json({
      success: true,
      message: "API connection successful!",
      response: response,
      apiKeyPresent: !!process.env.NVIDIA_API_KEY,
    });
  } catch (error) {
    console.error("API Test Error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      apiKeyPresent: !!process.env.NVIDIA_API_KEY,
    });
  }
});

// Function to format the response text
function formatResponse(text) {
  // First, identify and format section headings (Main Headings)
  text = text.replace(
    /\*\*(.*?)\*\*/g,
    "%%SECTION_HEADING%%$1%%SECTION_HEADING%%"
  );

  // Identify and format sub-headings
  text = text.replace(
    /^(.*?)[\r\n]*?[-=]{3,}$/gm,
    "%%SUBHEADING%%$1%%SUBHEADING%%"
  );

  // Split the text into sections based on the headings
  const sections = text.split("%%SECTION_HEADING%%");
  let formatted = "";

  for (let i = 0; i < sections.length; i++) {
    if (i % 2 === 1) {
      // This is a main heading - style it with a proper heading tag and margin
      formatted += `<h2 class="main-heading">${sections[i]}</h2>`;
    } else {
      let content = sections[i];

      // Process sub-headings if they exist
      const subheadingParts = content.split("%%SUBHEADING%%");
      if (subheadingParts.length > 1) {
        let processedContent = "";

        for (let j = 0; j < subheadingParts.length; j++) {
          if (j % 2 === 1) {
            // This is a sub-heading
            processedContent += `<h3 class="sub-heading">${subheadingParts[j]}</h3>`;
          } else {
            // Process the content between or after subheadings
            processedContent += processContentBlocks(subheadingParts[j]);
          }
        }
        content = processedContent;
      } else {
        // No subheadings, process the content as is
        content = processContentBlocks(content);
      }

      formatted += content;
    }
  }

  // Enhancement: Format "key: value" patterns that likely represent statistics
  formatted = formatted.replace(
    /(?:<li.*?>|<p.*?>)(.*?):\s*(.*?)(?=<\/li>|<\/p>)/g,
    (match, key, value) => {
      // If value contains numbers or percentages, highlight them
      if (/\d+%|\$\d+|million|billion|trillion/i.test(value)) {
        return `${match.substring(
          0,
          match.indexOf(key)
        )}<span class="stat-label">${key}:</span> <span class="stat-value">${value}</span>`;
      }
      return `${match.substring(
        0,
        match.indexOf(key)
      )}<span class="stat-label">${key}:</span> ${value}`;
    }
  );

  // Handle data points and statistics with highlighting
  formatted = formatted.replace(
    /(\d+(?:\.\d+)?%)/g,
    '<span class="stat-value">$1</span>'
  );
  formatted = formatted.replace(
    /(\$\d+(?:\.\d+)?(?:\s*[bmtk]illion|\s*trillion)?)/gi,
    '<span class="stat-value">$1</span>'
  );

  // Format nested list items (marked with + or -)
  formatted = formatted.replace(
    /<li class="list-item">(.*)<br>\s*[-+]\s*(.*?)(?=<br>|<\/li>)/g,
    (match, mainItem, subItem) => {
      // Create a nested list for the sub-items
      return `<li class="list-item-parent">${mainItem}<ul class="nested-list"><li class="nested-list-item">${subItem}</li>`;
    }
  );

  // Close any nested lists that were opened
  formatted = formatted.replace(/(<\/li>)(?!\s*<li|\s*<\/ul>)/g, "</ul>$1");

  // Add distinct styling to recommendations section
  formatted = formatted.replace(
    /<h2 class="main-heading">(Recommendations|Key Takeaways|Actionable Insights)<\/h2>/g,
    '<div class="recommendations-box">' +
      '<h2 class="recommendations-heading">$1</h2>'
  );

  // Close the recommendation div if we opened one
  if (formatted.includes('<div class="recommendations-box">')) {
    formatted += "</div>";
  }

  return formatted;
}

// Helper function to process content blocks
function processContentBlocks(text) {
  // Process bullet points and paragraphs
  if (text.includes("* ") || text.includes("+ ") || text.includes("- ")) {
    // Start a list if we detect bullet points
    const lines = text.split("\n");
    let inList = false;
    let processedContent = "";
    let listPrefix = "";

    for (let line of lines) {
      const trimmedLine = line.trim();

      if (
        trimmedLine.startsWith("* ") ||
        trimmedLine.startsWith("+ ") ||
        trimmedLine.startsWith("- ")
      ) {
        // This is a bullet point
        if (!inList) {
          // Start a new list
          processedContent += '<ul class="content-list">';
          inList = true;
        }

        // Determine if this is the top level or a nested bullet point
        if (trimmedLine.startsWith("* ")) {
          listPrefix = "* ";
        } else if (
          trimmedLine.startsWith("+ ") ||
          trimmedLine.startsWith("- ")
        ) {
          listPrefix = trimmedLine.substring(0, 2);
        }

        // Add a list item
        const bulletContent = trimmedLine.substring(listPrefix.length);
        processedContent += `<li class="list-item">${bulletContent}</li>`;
      } else if (trimmedLine.length > 0) {
        // This is regular text
        if (inList) {
          // End the current list
          processedContent += "</ul>";
          inList = false;
        }
        // Add a paragraph
        processedContent += `<p class="content-paragraph">${trimmedLine}</p>`;
      } else if (trimmedLine.length === 0 && inList) {
        // Empty line while in a list - end the list
        processedContent += "</ul>";
        inList = false;
      } else if (trimmedLine.length === 0) {
        // Empty line - add some spacing
        processedContent += '<div class="spacer"></div>';
      }
    }

    // Close any open list
    if (inList) {
      processedContent += "</ul>";
    }

    return processedContent;
  } else {
    // No bullet points - format paragraphs
    return text
      .split("\n")
      .filter((line) => line.trim().length > 0)
      .map((line) => `<p class="content-paragraph">${line}</p>`)
      .join("");
  }
}

// Function to check if a query is related to market research
function isMarketRelatedQuery(query) {
  const marketTerms = [
    "market",
    "industry",
    "consumer",
    "competitor",
    "business",
    "trend",
    "analysis",
    "research",
    "sales",
    "pricing",
    "product",
    "strategy",
    "customer",
    "segment",
    "niche",
    "demographic",
    "brand",
    "advertising",
    "marketing",
    "revenue",
    "growth",
    "forecast",
    "economy",
    "sector",
    "company",
    "startup",
    "investment",
    "stock",
    "share",
    "profit",
    "retail",
    "wholesale",
    "supply",
    "demand",
    "commerce",
    "trade",
    "B2B",
    "B2C",
  ];

  const lowerQuery = query.toLowerCase();
  return marketTerms.some((term) => lowerQuery.includes(term));
}

// API endpoint for chat completions
app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    // Check if the query is related to market research
    if (!isMarketRelatedQuery(userMessage)) {
      // Return a friendly response for non-market related queries
      const nonMarketResponse = `
        <div class="off-topic-message">
          <h2 class="main-heading">Not Market Research Related</h2>
          <p class="content-paragraph">I'm designed to assist specifically with market research questions. 
          Your question doesn't appear to be related to market research, industry analysis, 
          consumer insights, or business strategy.</p>
          <p class="content-paragraph">Please try asking about market trends, competitor analysis, 
          consumer behavior, industry forecasts, or business strategies instead.</p>
        </div>
      `;
      return res.json({ response: nonMarketResponse });
    }

    // Create a market research context
    const systemPrompt = `You are an expert market research assistant. 
    Provide detailed, data-driven insights on markets, industries, consumer behavior, and competitive landscapes.
    
    Format your responses with these structural elements:
    1. Start with a clear title using "**Title**" format
    2. For each major section, use a clear heading followed by a row of dashes (---------)
    3. Use bullet points with the following hierarchy:
       * For main points (use asterisk)
       + For sub-points (use plus sign)
       - For tertiary points (use minus sign)
    4. For statistics and data points, use the format "Category: Value" (e.g., "Market Size: $4.5 billion")
    5. Include specific numbers, percentages and dollar amounts whenever possible
    6. Always end with a "**Recommendations**" section
    
    Make your responses visually appealing with clear hierarchy and organization.
    Focus on these areas: market trends, industry analysis, consumer behavior, competitive landscape, and market sizing.
    Keep responses professional, organized, and actionable.`;

    const completion = await openai.chat.completions.create({
      model: "nvidia/llama-3.1-nemotron-70b-instruct",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
      top_p: 1,
      max_tokens: 800,
    });

    let responseText =
      completion.choices[0]?.message?.content ||
      "I'm having trouble processing that request. Please try again.";

    // Format the response for better display
    responseText = formatResponse(responseText);

    res.json({ response: responseText });
  } catch (error) {
    console.error("Error with NVIDIA API:", error);
    res.status(500).json({
      error: "Failed to get a response",
      details: error.message,
    });
  }
});

// All routes that don't match files should serve index.html
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "src/index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
