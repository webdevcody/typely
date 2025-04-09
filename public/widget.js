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
      background-color: #007bff;
      color: white;
      border: none;
      cursor: pointer;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }

    .chat-widget-container {
      position: fixed;
      bottom: 100px;
      right: 20px;
      width: 300px;
      height: 400px;
      background: white;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      display: none;
      flex-direction: column;
    }

    .chat-widget-header {
      padding: 15px;
      background: #007bff;
      color: white;
      border-radius: 10px 10px 0 0;
    }

    .chat-widget-messages {
      flex-grow: 1;
      padding: 15px;
      overflow-y: auto;
    }

    .chat-message {
      margin-bottom: 10px;
      padding: 8px 12px;
      border-radius: 8px;
      max-width: 80%;
    }

    .assistant-message {
      background-color: #f0f0f0;
      margin-right: auto;
    }

    .user-message {
      background-color: #007bff;
      color: white;
      margin-left: auto;
    }

    .chat-widget-input-container {
      padding: 15px;
      border-top: 1px solid #eee;
      display: flex;
      gap: 10px;
    }

    .chat-widget-input {
      flex-grow: 1;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .chat-widget-submit {
      padding: 8px 15px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
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
  `;

  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);

  // Create widget button
  const button = document.createElement("button");
  button.className = "chat-widget-button";
  button.innerHTML = "💬";
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
      const response = await fetch(`${senseiProdUrl}/getChatSessions`, {
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

      // Update lastMessageTimestamp if we received any messages
      if (messages.length > 0) {
        lastMessageTimestamp = Math.max(
          ...messages.map((msg) => msg.createdAt)
        );
      }

      // Add all new messages to the chat
      messages.forEach((message) => {
        if (message.role === "assistant") {
          addMessageToChat(message.content, true);
        }
      });
    } catch (error) {
      debug("Error fetching messages:", error);
      // Only show error if it's not a polling request
      if (!lastMessageTimestamp) {
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

  // Update sendChatMessage to not fetch messages immediately
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
      debug("Sending to server...");

      const response = await fetch(`${senseiProdUrl}/chatMessages`, {
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

      const data = await response.json();
      debug("Message sent successfully:", data);

      // Remove fetchLatestMessages call since polling will handle it
    } catch (error) {
      debug("Error sending message:", error);
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
