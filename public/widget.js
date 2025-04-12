(function () {
  const senseiProdUrl = "https://upbeat-fox-708.convex.site";
  const DEBUG = true; // Enable debug logging
  const POLLING_INTERVAL = 3000; // Poll every 3 seconds
  let lastMessageTimestamp = 0;
  let pollingInterval = null;
  const initialAssistantMessage =
    window.sensei.initialAssistantMessage ?? "Hello! How can I help you today?";

  function debug(...args) {
    if (DEBUG) {
      console.log("Chat Widget:", ...args);
    }
  }

  // Validate required configuration
  if (!window.sensei || !window.sensei.siteId) {
    throw new Error(
      "window.sensei.siteId must be configured for the chat widget to work"
    );
  }

  const styles = `
    .chat-widget-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(to bottom right, #007bff, #0056b3);
      color: white;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .chat-widget-button svg {
      width: 28px;
      height: 28px;
      stroke-width: 2;
    }

    .chat-widget-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 123, 255, 0.4);
    }

    .chat-widget-container {
      font-family: 'Inter', sans-serif;
      position: fixed;
      bottom: 100px;
      right: 20px;
      width: 380px;
      height: 600px;
      background: #141518;
      border: 1px solid #262932;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
      display: none;
      flex-direction: column;
    }

    .chat-widget-header {
      padding: 16px 20px;
      background: #1C1F26;
      color: white;
      border-bottom: 1px solid #262932;
      border-radius: 12px 12px 0 0;
      font-weight: 600;
    }

    .chat-widget-messages {
      flex-grow: 1;
      padding: 20px;
      overflow-y: auto;
      background: #141518;
      scrollbar-width: thin;
      scrollbar-color: #262932 #141518;
    }

    .chat-widget-messages::-webkit-scrollbar {
      width: 6px;
    }

    .chat-widget-messages::-webkit-scrollbar-track {
      background: #141518;
    }

    .chat-widget-messages::-webkit-scrollbar-thumb {
      background-color: #262932;
      border-radius: 3px;
    }

    .chat-message {
      margin-bottom: 12px;
      padding: 12px 16px;
      border-radius: 12px;
      max-width: 85%;
      word-break: break-word;
      line-height: 1.5;
      font-size: 14px;
    }

    .assistant-message {
      background-color: #1C1F26;
      border: 1px solid #262932;
      color: #e1e1e6;
      margin-right: auto;
    }

    .user-message {
      background: linear-gradient(to bottom right, #007bff, #0056b3);
      color: white;
      margin-left: auto;
      border: none;
    }

    .chat-widget-input-container {
      padding: 16px;
      border-top: 1px solid #262932;
      background: #1C1F26;
      border-radius: 0 0 12px 12px;
      display: flex;
      gap: 12px;
    }

    .chat-widget-input {
      flex-grow: 1;
      padding: 12px;
      background: #141518;
      border: 1px solid #262932;
      border-radius: 8px;
      color: white;
      font-size: 14px;
      transition: border-color 0.2s;
    }

    .chat-widget-input:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 1px #007bff;
    }

    .chat-widget-input::placeholder {
      color: #506882;
    }

    .chat-widget-submit {
      padding: 12px 20px;
      background: linear-gradient(to bottom right, #007bff, #0056b3);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: opacity 0.2s, transform 0.2s;
    }

    .chat-widget-submit:hover:not(:disabled) {
      transform: translateY(-1px);
    }

    .chat-widget-submit:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .loading-dots:after {
      content: '.';
      animation: dots 1.5s steps(5, end) infinite;
    }

    @keyframes dots {
      0%, 20% { content: '.'; }
      40% { content: '..'; }
      60% { content: '...'; }
      80%, 100% { content: ''; }
    }

    .thinking-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background-color: #1C1F26;
      border: 1px solid #262932;
      color: #e1e1e6;
      border-radius: 12px;
      margin-bottom: 12px;
      max-width: 85%;
      margin-right: auto;
      font-size: 14px;
    }

    .thinking-dots {
      display: inline-flex;
      gap: 4px;
      align-items: center;
      height: 20px;
    }

    .thinking-dots span {
      width: 4px;
      height: 4px;
      background-color: #506882;
      border-radius: 50%;
      animation: thinking 1.4s infinite;
      opacity: 0.5;
    }

    .thinking-dots span:nth-child(2) {
      animation-delay: 0.2s;
    }

    .thinking-dots span:nth-child(3) {
      animation-delay: 0.4s;
    }

    @keyframes thinking {
      0%, 100% {
        transform: translateY(0);
        opacity: 0.5;
      }
      50% {
        transform: translateY(-4px);
        opacity: 1;
      }
    }
  `;

  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);

  // Create widget button with SVG icon
  const button = document.createElement("button");
  button.className = "chat-widget-button";
  button.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>';
  document.body.appendChild(button);

  // Function to add a message to the chat
  function addMessageToChat(content, isAssistant = false, isError = false) {
    debug("Adding message:", { content, isAssistant, isError });
    const messagesContainer = chatContainer.querySelector(
      ".chat-widget-messages"
    );
    const messageDiv = document.createElement("div");
    messageDiv.className = `chat-message ${isAssistant ? "assistant-message" : "user-message"}`;
    if (isError) {
      messageDiv.style.backgroundColor = "#ff4444";
      messageDiv.style.color = "white";
    }
    messageDiv.textContent = content;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    debug("Message added to container");
  }

  // Function to set loading state
  function setLoading(isLoading) {
    const submitButton = chatContainer.querySelector(".chat-widget-submit");
    const input = chatContainer.querySelector(".chat-widget-input");
    submitButton.disabled = isLoading;
    input.disabled = isLoading;
    submitButton.textContent = isLoading ? "Sending" : "Send";
    if (isLoading) {
      submitButton.classList.add("loading-dots");
    } else {
      submitButton.classList.remove("loading-dots");
    }
  }

  // Function to create a new chat session
  async function createChatSession() {
    debug("Creating new chat session");
    try {
      const response = await fetch(`${senseiProdUrl}/chatSessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          siteId: window.sensei.siteId,
        }),
      });

      debug("Chat session response:", response.status);
      if (!response.ok) {
        throw new Error("Failed to create chat session");
      }

      const data = await response.json();
      debug("Chat session created:", data);

      const { sessionId } = data;

      // Store the session ID in localStorage
      localStorage.setItem("chatSessionId", sessionId);

      // Display the initial message if we have one
      if (initialAssistantMessage) {
        addMessageToChat(initialAssistantMessage, true);
      } else {
        debug("No initial assistant message received");
        addMessageToChat("Hello! How can I help you today?", true);
      }
    } catch (error) {
      debug("Error creating chat session:", error);
      addMessageToChat(
        "Sorry, there was an error connecting to the chat service. Please try again later.",
        false,
        true
      );
    }
  }

  // Function to fetch latest messages
  async function fetchLatestMessages(chatSessionId) {
    debug("Fetching latest messages");
    try {
      const response = await fetch(senseiProdUrl + "/getChatSessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatSessionId,
          createdAfter: lastMessageTimestamp,
        }),
      });

      debug("Messages response:", response.status);
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const { messages } = await response.json();
      debug("Received messages:", messages);

      // Only process if we have new messages
      if (messages && messages.length > 0) {
        // Update lastMessageTimestamp
        lastMessageTimestamp = Math.max(
          ...messages.map((msg) => msg.createdAt)
        );

        // Process new messages
        const assistantMessages = messages.filter(
          (msg) => msg.role === "assistant"
        );

        if (assistantMessages.length > 0) {
          // Remove thinking indicator first
          const thinkingIndicator = chatContainer.querySelector(
            ".thinking-indicator"
          );
          if (thinkingIndicator) {
            thinkingIndicator.remove();
          }

          // Then add all new assistant messages
          assistantMessages.forEach((message) => {
            addMessageToChat(message.content, true);
          });

          // Scroll to the latest message
          const messagesContainer = chatContainer.querySelector(
            ".chat-widget-messages"
          );
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      }
    } catch (error) {
      debug("Error fetching messages:", error);
      // Only show error if it's not a polling request
      if (!lastMessageTimestamp) {
        // Remove thinking indicator if there's an error
        const thinkingIndicator = chatContainer.querySelector(
          ".thinking-indicator"
        );
        if (thinkingIndicator) {
          thinkingIndicator.remove();
        }

        addMessageToChat(
          "Sorry, there was an error getting the response. Please try again.",
          false,
          true
        );
      }
    }
  }

  // Create chat container
  const chatContainer = document.createElement("div");
  chatContainer.className = "chat-widget-container";
  chatContainer.innerHTML = `
    <div class="chat-widget-header">Chat Widget</div>
    <div class="chat-widget-messages"></div>
    <div class="chat-widget-input-container">
      <input type="text" class="chat-widget-input" placeholder="Type your message...">
      <button class="chat-widget-submit">Send</button>
    </div>
  `;
  document.body.appendChild(chatContainer);

  // Add event listeners
  button.addEventListener("click", async () => {
    const isVisible = chatContainer.style.display === "flex";

    if (!isVisible) {
      chatContainer.style.display = "flex";
      debug("No existing session, creating new one");
      await createChatSession();

      // Start polling when chat is opened
      pollingInterval = setInterval(() => {
        const sessionId = localStorage.getItem("chatSessionId");
        if (sessionId) {
          fetchLatestMessages(sessionId);
        }
      }, POLLING_INTERVAL);
    } else {
      // Stop polling when chat is closed
      if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
      }
      chatContainer.style.display = "none";
    }
  });

  const input = chatContainer.querySelector(".chat-widget-input");
  const submitButton = chatContainer.querySelector(".chat-widget-submit");

  submitButton.addEventListener("click", () => {
    const message = input.value.trim();
    if (message) {
      sendChatMessage(message);
      input.value = "";
    }
  });

  // Allow enter key to submit
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      submitButton.click();
    }
  });

  // Update sendChatMessage to only add thinking indicator
  async function sendChatMessage(content) {
    debug("Sending message:", content);
    const chatSessionId = localStorage.getItem("chatSessionId");
    if (!chatSessionId) {
      debug("No chat session found");
      addMessageToChat(
        "Session not found. Please refresh the page.",
        false,
        true
      );
      return;
    }

    setLoading(true);
    try {
      // Add user message to UI immediately
      addMessageToChat(content, false);

      // Add thinking indicator
      const messagesContainer = chatContainer.querySelector(
        ".chat-widget-messages"
      );
      const thinkingDiv = document.createElement("div");
      thinkingDiv.className = "thinking-indicator";
      thinkingDiv.innerHTML =
        '<div class="thinking-dots"><span></span><span></span><span></span></div>';
      thinkingDiv.insertAdjacentText("afterbegin", "Sensei is thinking ");
      messagesContainer.appendChild(thinkingDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;

      debug("Sending to server...");

      const response = await fetch(senseiProdUrl + "/chatMessages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatSessionId,
          content,
          siteId: window.sensei.siteId,
        }),
      });

      debug("Server response:", response.status);
      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      await response.json();
      debug("Message sent successfully");

      // Note: We don't remove the thinking indicator here anymore
      // It will be removed when the polling receives new messages
    } catch (error) {
      debug("Error sending message:", error);
      // Remove thinking indicator if it exists
      const thinkingIndicator = chatContainer.querySelector(
        ".thinking-indicator"
      );
      if (thinkingIndicator) {
        thinkingIndicator.remove();
      }
      addMessageToChat(
        "Sorry, there was an error sending your message. Please try again.",
        false,
        true
      );
    } finally {
      setLoading(false);
    }
  }
})();
