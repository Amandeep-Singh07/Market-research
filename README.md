# Market Research Chatbot

A web-based chatbot that conducts market research and provides analysis on various industries, trends, and consumer behaviors.

## Features

- Interactive chat interface to ask market research questions
- Category buttons for quick access to common research topics
- Responsive design that works on mobile and desktop
- Pre-loaded market research data for demonstration purposes
- Typing indicators and smooth animations for a modern experience

## Technologies Used

- HTML5
- Tailwind CSS for styling
- JavaScript (Vanilla) for functionality
- Font Awesome for icons
- Express.js for deployment server

## Getting Started

### Local Development

1. Clone or download this repository
2. Install dependencies with `npm install`
3. Start the development server with `npm run dev`
4. Open `http://localhost:3000` in your web browser

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
6. Click "Create Web Service"
7. Your app will be deployed in a few minutes at a URL like `https://market-research-chatbot.onrender.com`

## Project Structure

```
market-research-chatbot/
├── src/                # Source files
│   ├── index.html      # Main HTML file
│   ├── styles.css      # CSS styles
│   └── script.js       # JavaScript logic
├── server.js           # Express server for deployment
├── package.json        # NPM package configuration
├── render.yaml         # Render deployment configuration
└── README.md           # Project documentation
```

## Troubleshooting Deployment

If you encounter errors during deployment, try these solutions:

### Error: Cannot find package.json

- Make sure your package.json is in the repository root (not in a subdirectory)
- Verify the rootDir setting in render.yaml points to where package.json is located

### Error: Cannot find module 'express'

- Check if dependencies are properly installed by running `npm install` locally
- Verify the build command is correctly set to `npm install`

### Error: Port already in use

- The app uses the PORT environment variable, which Render sets automatically
- For local development, make sure port 3000 is available or change it in server.js

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

- Connect to actual market research APIs for real-time data
- Add user authentication for personalized research
- Implement machine learning for better query understanding
- Support data visualization for market statistics
- Add export functionality for research reports

## License

MIT

## Author

Your Name
