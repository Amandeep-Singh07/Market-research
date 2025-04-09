# Market Research Chatbot (AI-Powered)

A web-based chatbot that conducts dynamic market research and provides analysis on various industries, trends, and consumer behaviors using NVIDIA's AI API.

## Features

- AI-powered responses using NVIDIA's Llama 3.1 model
- Interactive chat interface to ask market research questions
- Category buttons for quick access to common research topics
- Responsive design that works on mobile and desktop
- Dynamic, data-driven responses based on your specific questions
- Typing indicators and smooth animations for a modern experience

## Technologies Used

- HTML5
- Tailwind CSS for styling
- JavaScript for frontend functionality
- Express.js for backend server
- OpenAI API client with NVIDIA's LLM service
- Font Awesome for icons

## Getting Started

### Local Development

1. Clone or download this repository
2. Install dependencies with `npm install`
3. Create a `.env` file with your NVIDIA API key:
   ```
   NVIDIA_API_KEY=your-api-key-here
   ```
4. Start the development server with `npm run dev`
5. Open `http://localhost:3000` in your web browser

### Deployment on Render

1. Fork or push this repository to your GitHub account
2. Go to [Render](https://render.com/) and create an account if you don't have one
3. Click "New +" and select "Web Service"
4. Connect your GitHub repository
5. Use these settings:
   - Name: market-research-chatbot (or your preferred name)
   - Environment: Node
   - Root Directory: Leave blank (this uses the repository root)
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add the environment variable:
   - NVIDIA_API_KEY (your NVIDIA API key)
7. Click "Create Web Service"
8. Your app will be deployed in a few minutes at a URL like `https://market-research-chatbot.onrender.com`

## Project Structure

```
market-research-chatbot/
├── src/                # Frontend source files
│   ├── index.html      # Main HTML file
│   ├── styles.css      # CSS styles
│   └── script.js       # Frontend JavaScript
├── server.js           # Express server & API integration
├── package.json        # NPM package configuration
├── render.yaml         # Render deployment configuration
└── README.md           # Project documentation
```

## API Integration

This chatbot uses NVIDIA's AI services through their API. The backend:

1. Receives user queries from the frontend
2. Sends them to NVIDIA's AI model with market research context
3. Returns the AI-generated responses to the frontend
4. Presents the information in a user-friendly format

## 🧐 Step-by-Step: Integrating an API Key to Make a Chatbot

### 🛠 1. Choose Your Stack (Frontend/Backend)
Let’s keep it simple:

- **Frontend:** React / HTML + JS
- **Backend:** Node.js / Python (Flask or FastAPI are great)
- **API:** OpenAI, or another chatbot service

### 🔐 2. Get Your API Key
- Sign up at https://platform.openai.com/
- Go to your **API keys** under user settings
- Click **Create new secret key**, then copy it (and **never** hardcode it into frontend JS—unless you want it stolen like candy from a baby 👶🍭)

### 📦 3. Set Up Environment Variables (Safe Storage)
In your **backend**, create a `.env` file:

```env
OPENAI_API_KEY=sk-your-key-here
```

Then load it in your code (e.g., using `dotenv` in Node.js):

```js
require('dotenv').config();
const apiKey = process.env.OPENAI_API_KEY;
```

Or in Python:

```python
from dotenv import load_dotenv
import os
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
```

### 🔄 4. Create a Backend Endpoint to Call the API

**Example (Node.js + Express):**

```js
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    res.json(response.data.choices[0].message);
  } catch (err) {
    res.status(500).send("Something went wrong: " + err.message);
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
```

### 🧼 5. Frontend Calls Backend

```js
const sendMessage = async (message) => {
  const res = await fetch("http://localhost:3000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });

  const data = await res.json();
  console.log("Bot says:", data.content);
};
```

### 🔐 Bonus: Hide Your Key in Production
- NEVER expose your key in frontend JS
- Use a proxy server/backend
- For deployment, store your `.env` values in services like Vercel, Render, or Heroku environment settings

## Troubleshooting Deployment

If you encounter errors during deployment, try these solutions:

### Error: Cannot find package.json
- Make sure your package.json is in the repository root (not in a subdirectory)
- Verify the rootDir setting in render.yaml points to where package.json is located

### Error: Cannot find module 'express' or 'openai'
- Check if dependencies are properly installed by running `npm install` locally
- Verify the build command is correctly set to `npm install`

### Error: API key related issues
- Ensure the NVIDIA_API_KEY environment variable is set correctly in Render
- Check the API key permissions and quotas in your NVIDIA account

## How to Use

- Type your market research question in the input field and press Enter or click the send button
- Click on any of the category buttons to get information about that topic
- Try asking about specific industries like "tech", "healthcare", "retail", etc.
- Ask about market trends, competitor analysis, or consumer behavior

## Example Queries

- "What's the market size for electric vehicles?"
- "Tell me about trends in the tech industry"
- "Who are the main competitors in healthcare?"
- "What are current consumer behavior insights?"
- "What are the pricing strategies used in retail?"

## Future Improvements

- Fine-tune the AI model for more accurate market research responses
- Add data visualization for market statistics
- Implement user authentication for personalized research
- Enable saving of conversation history
- Add export functionality for research reports

## License

MIT

## Author

Amandeep Singh

