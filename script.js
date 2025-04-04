document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chat-form");
  const userInput = document.getElementById("user-input");
  const chatMessages = document.getElementById("chat-messages");
  const topicButtons = document.querySelectorAll(".topic-btn");

  // Sample market research data - in a real application, this would come from an API
  const marketData = {
    "market trends": [
      "Digital transformation is accelerating across industries",
      "Sustainability is becoming a key factor in consumer decisions",
      "Remote work is reshaping office space demand",
      "E-commerce continues to grow at 14-16% annually",
      "Subscription-based business models are gaining popularity",
    ],
    "consumer behavior": [
      "Consumers increasingly prefer omnichannel shopping experiences",
      "Value-conscious purchasing is rising due to economic uncertainty",
      "Personalization is expected by 76% of consumers",
      "Mobile commerce represents over 70% of digital transactions",
      "Social media strongly influences purchase decisions for 82% of Gen Z",
    ],
    competitors: [
      "Market consolidation is occurring in many mature industries",
      "Direct-to-consumer brands are disrupting traditional retail",
      "Tech giants are expanding into adjacent markets",
      "Startups with innovative business models are gaining market share",
      "Strategic partnerships are being formed to compete with larger players",
    ],
    "industry analysis": [
      "Healthcare sees increased telemedicine adoption",
      "Financial services face disruption from fintech",
      "Manufacturing is adopting automation and IoT",
      "Retail is evolving to experiential shopping",
      "Education is being transformed by digital learning",
    ],
    "pricing strategies": [
      "Dynamic pricing is becoming standard in many industries",
      "Value-based pricing is replacing cost-plus approaches",
      "Subscription tiers optimize revenue across customer segments",
      "Freemium models allow wide adoption with premium upsells",
      "Bundle pricing increases average order value",
    ],
    "innovation insights": [
      "AI and machine learning are transforming product development",
      "Open innovation ecosystems accelerate R&D outcomes",
      "Circular economy principles are driving sustainable innovation",
      "Innovation labs are being established across industries",
      "Decentralized technologies are creating new business models",
    ],
  };

  // Industry specific data
  const industries = {
    tech: {
      growth: "Annual growth rate of 12-15%",
      trends: [
        "Cloud computing",
        "AI adoption",
        "Cybersecurity",
        "Edge computing",
      ],
      challenges: [
        "Talent shortage",
        "Regulatory scrutiny",
        "Data privacy concerns",
      ],
    },
    healthcare: {
      growth: "Annual growth rate of 8-10%",
      trends: [
        "Telemedicine",
        "AI diagnostics",
        "Personalized medicine",
        "Health data platforms",
      ],
      challenges: ["Regulatory compliance", "Interoperability", "Rising costs"],
    },
    retail: {
      growth: "Annual growth rate of 3-5%",
      trends: [
        "Omnichannel",
        "Experiential retail",
        "Automated checkout",
        "Social commerce",
      ],
      challenges: [
        "E-commerce competition",
        "Supply chain disruptions",
        "Changing consumer preferences",
      ],
    },
    finance: {
      growth: "Annual growth rate of 5-7%",
      trends: [
        "Digital banking",
        "Blockchain",
        "Robo-advisors",
        "Embedded finance",
      ],
      challenges: ["Regulatory changes", "Cybersecurity", "Fintech disruption"],
    },
    automotive: {
      growth: "Annual growth rate of 2-4%",
      trends: [
        "Electric vehicles",
        "Autonomous driving",
        "Connected cars",
        "Mobility-as-a-service",
      ],
      challenges: [
        "Supply chain issues",
        "Chip shortages",
        "Shifting to electric",
      ],
    },
  };

  // Add a user message to the chat
  function addUserMessage(message) {
    const messageElement = document.createElement("div");
    messageElement.className = "chat-message user";
    messageElement.innerHTML = `
            <div class="flex items-start justify-end">
                <div class="mr-3 bg-indigo-100 p-3 rounded-lg">
                    <p>${message}</p>
                </div>
                <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    <i class="fas fa-user"></i>
                </div>
            </div>
        `;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Add a bot message to the chat
  function addBotMessage(message) {
    const messageElement = document.createElement("div");
    messageElement.className = "chat-message bot";
    messageElement.innerHTML = `
            <div class="flex items-start">
                <div class="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="ml-3 bg-indigo-100 p-3 rounded-lg">
                    <p>${message}</p>
                </div>
            </div>
        `;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Add typing indicator
  function showTypingIndicator() {
    const typingIndicator = document.createElement("div");
    typingIndicator.className = "chat-message bot typing-indicator-container";
    typingIndicator.id = "typing-indicator";
    typingIndicator.innerHTML = `
            <div class="flex items-start">
                <div class="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="ml-3 bg-indigo-100 p-3 rounded-lg">
                    <div class="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Remove typing indicator
  function removeTypingIndicator() {
    const typingIndicator = document.getElementById("typing-indicator");
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  // Process user input and generate a response
  function processUserInput(input) {
    const lowerInput = input.toLowerCase();
    let response = "";

    // Check for industry-specific queries
    for (const industry in industries) {
      if (lowerInput.includes(industry)) {
        const industryData = industries[industry];
        response = `<strong>${industry.toUpperCase()} Industry Insights:</strong><br>
                    <strong>Growth:</strong> ${industryData.growth}<br>
                    <strong>Key Trends:</strong> ${industryData.trends.join(
                      ", "
                    )}<br>
                    <strong>Key Challenges:</strong> ${industryData.challenges.join(
                      ", "
                    )}`;
        return response;
      }
    }

    // Check for category-based queries
    for (const category in marketData) {
      if (lowerInput.includes(category)) {
        response = `<strong>Here are some insights about ${category}:</strong><br>`;
        marketData[category].forEach((item) => {
          response += `• ${item}<br>`;
        });
        return response;
      }
    }

    // Handle specific market research questions
    if (
      lowerInput.includes("market size") ||
      lowerInput.includes("how big is")
    ) {
      response =
        "Market size analysis typically requires specific industry data. I can provide estimates for common sectors:<br><br>" +
        "• Global E-commerce: $4.9 trillion (2021), expected to reach $7.4 trillion by 2025<br>" +
        "• Cloud Computing: $445.3 billion (2021), projected to reach $947.3 billion by 2026<br>" +
        "• Electric Vehicles: $287.4 billion (2021), expected to reach $1.3 trillion by 2028<br>" +
        "• Artificial Intelligence: $93.5 billion (2021), projected to reach $1.8 trillion by 2030";
    } else if (
      lowerInput.includes("competitor") ||
      lowerInput.includes("competition")
    ) {
      response =
        "Competitive analysis typically includes:<br><br>" +
        "• Direct competitors (similar products/services)<br>" +
        "• Indirect competitors (alternative solutions)<br>" +
        "• Positioning and unique value propositions<br>" +
        "• Market share and growth rates<br>" +
        "• SWOT analysis of key players<br><br>" +
        "For specific competitor analysis, please mention the industry or market segment.";
    } else if (
      lowerInput.includes("trend") ||
      lowerInput.includes("trending")
    ) {
      response =
        "Current market trends include:<br><br>" +
        "• Increased focus on sustainability and ESG<br>" +
        "• Digital transformation across industries<br>" +
        "• Rise of direct-to-consumer business models<br>" +
        "• Subscription and membership-based revenue streams<br>" +
        "• Data-driven decision making and personalization";
    } else if (
      lowerInput.includes("consumer") ||
      lowerInput.includes("customer")
    ) {
      response =
        "Consumer behavior insights:<br><br>" +
        "• 73% of consumers consider experience as important as product/service<br>" +
        "• 67% are willing to pay more for sustainable products<br>" +
        "• 64% expect personalized experiences based on past interactions<br>" +
        "• 58% have switched brands due to poor customer service<br>" +
        "• 76% prefer digital self-service options for simple transactions";
    } else {
      response =
        "I can help with market research queries about:<br><br>" +
        "• Industry analysis and market sizes<br>" +
        "• Consumer behavior and preferences<br>" +
        "• Competitive landscapes<br>" +
        "• Market trends and forecasts<br>" +
        "• Pricing strategies<br><br>" +
        "Please ask a specific question about these topics or click one of the category buttons below.";
    }

    return response;
  }

  // Handle form submission
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = userInput.value.trim();

    if (message) {
      addUserMessage(message);
      userInput.value = "";

      // Show typing indicator
      showTypingIndicator();

      // Simulate API delay
      setTimeout(() => {
        removeTypingIndicator();
        const response = processUserInput(message);
        addBotMessage(response);
      }, 1000);
    }
  });

  // Handle topic button clicks
  topicButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const topic = button.textContent.trim();
      const response = processUserInput(topic);

      // Show the user's selection
      addUserMessage(`Tell me about ${topic}`);

      // Show typing indicator
      showTypingIndicator();

      // Simulate API delay
      setTimeout(() => {
        removeTypingIndicator();
        addBotMessage(response);
      }, 1000);
    });
  });

  // Focus the input field on page load
  userInput.focus();
});
