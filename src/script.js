document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chat-form");
  const userInput = document.getElementById("user-input");
  const researchResults = document.getElementById("research-results");
  const recentQueries = document.getElementById("recent-queries");
  const loadingIndicator = document.getElementById("loading-indicator");
  const welcomeMessage = document.querySelector(".welcome-message");
  const topicButtons = document.querySelectorAll(".topic-btn");

  // Keep track of recent queries
  const queries = [];
  const MAX_STORED_QUERIES = 5;

  // Add a query to the recent queries list
  function addToRecentQueries(query) {
    // Don't add duplicates
    if (queries.includes(query)) {
      return;
    }

    // Add to front of array
    queries.unshift(query);

    // Keep only the most recent queries
    if (queries.length > MAX_STORED_QUERIES) {
      queries.pop();
    }

    // Update the UI
    updateRecentQueriesList();
  }

  // Update the recent queries list in the UI
  function updateRecentQueriesList() {
    recentQueries.innerHTML = "";

    if (queries.length === 0) {
      const noQueries = document.createElement("p");
      noQueries.textContent = "No recent queries";
      noQueries.style.color = "#6b7280";
      noQueries.style.fontStyle = "italic";
      noQueries.style.textAlign = "center";
      noQueries.style.padding = "1rem 0";
      recentQueries.appendChild(noQueries);
      return;
    }

    queries.forEach((query) => {
      const queryItem = document.createElement("div");
      queryItem.className = "query-item";
      queryItem.textContent = query;
      queryItem.addEventListener("click", () => {
        userInput.value = query;
        userInput.focus();
      });
      recentQueries.appendChild(queryItem);
    });
  }

  // Show loading state
  function showLoading() {
    loadingIndicator.classList.remove("hidden");
    welcomeMessage.style.display = "none";
  }

  // Hide loading state
  function hideLoading() {
    loadingIndicator.classList.add("hidden");
  }

  // Display research results
  function displayResults(content) {
    // Clear previous results
    researchResults.innerHTML = "";

    // Create the result container
    const resultElement = document.createElement("div");
    resultElement.className = "response-content";
    resultElement.innerHTML = content;

    // Add to the results area
    researchResults.appendChild(resultElement);

    // Scroll to top of results
    researchResults.scrollTop = 0;
  }

  // Process user input and get a response from the API
  async function processUserInput(input) {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("Error:", error);
      return `<div class="error-message">
                <h3>Sorry, I encountered an error</h3>
                <p>I couldn't process your request. Please try again later.</p>
                <p class="error-details">Error: ${error.message}</p>
              </div>`;
    }
  }

  // Handle form submission
  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const message = userInput.value.trim();

    if (message) {
      // Add to recent queries
      addToRecentQueries(message);

      // Clear input
      userInput.value = "";

      // Show loading state
      showLoading();

      // Get response from API
      const response = await processUserInput(message);

      // Hide loading state and display results
      hideLoading();
      displayResults(response);
    }
  });

  // Handle topic button clicks
  topicButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const topic = button.textContent.trim();
      const query = `Tell me about ${topic}`;

      // Add to recent queries
      addToRecentQueries(query);

      // Show loading state
      showLoading();

      // Get response from API
      const response = await processUserInput(
        `Provide detailed market research insights about ${topic} with specific data, statistics, and trends`
      );

      // Hide loading state and display results
      hideLoading();
      displayResults(response);
    });
  });

  // Initialize recent queries list
  updateRecentQueriesList();

  // Focus the input field on page load
  userInput.focus();
});
