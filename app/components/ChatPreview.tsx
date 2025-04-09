import { useEffect, useReducer, useRef, useState } from "react";

const AI_AVATAR_URL =
  "https://api.dicebear.com/7.x/bottts/svg?seed=site-sensei&backgroundColor=633CFF";
const USER_AVATAR_URL = "https://api.dicebear.com/7.x/avataaars/svg?seed=user";

type Message = {
  role: "user" | "ai";
  content: string;
};

type State = {
  messages: Message[];
  inputText: string;
  currentTypingText: string;
  conversationIndex: number;
  phase:
    | "ai_typing" // AI typing with typewriter effect
    | "user_typing" // User typing simulation
    | "user_submitted" // User message submitted
    | "ai_thinking"; // AI thinking animation
};

type Action =
  | { type: "SET_TYPING_TEXT"; text: string }
  | { type: "SET_INPUT_TEXT"; text: string }
  | { type: "COMPLETE_AI_TYPING" }
  | { type: "SUBMIT_USER_MESSAGE"; text: string }
  | { type: "START_AI_RESPONSE" }
  | { type: "START_USER_TYPING" };

const WELCOME_MESSAGE =
  "Hey there! I can answer any question you might have about our product";

const DEMO_CONVERSATIONS = [
  {
    user: "What's your return policy?",
    ai: "According to the website, we offer a 30-day money-back guarantee on all purchases. Just keep the original packaging! 📦",
  },
  {
    user: "How do I integrate the chat widget?",
    ai: "It's super easy! Just add two lines of code to your website. Need the exact code snippet? Check out our quick start guide 🚀",
  },
  {
    user: "Can the AI understand my website's content?",
    ai: "Absolutely! I automatically crawl and learn from your website's content. I can understand context and provide accurate answers specific to your site 🧠",
  },
  {
    user: "What makes Site Sensei different from other chat widgets?",
    ai: "Unlike generic chat widgets, I actually understand your website's content and context. I'm like having a 24/7 expert who's read every page of your site! 🌟",
  },
  {
    user: "How long does it take to set up?",
    ai: "Most websites are up and running in under 5 minutes! Just paste our code snippet and let me crawl your site. I'll start helping your users right away 🚀",
  },
  {
    user: "Can you handle multiple languages?",
    ai: "Yes! I can understand and respond in multiple languages, making your website accessible to a global audience 🌍",
  },
  {
    user: "Do you support custom branding?",
    ai: "Absolutely! You can customize my appearance to match your brand - colors, logos, and even my personality can be tailored to your needs 🎨",
  },
  {
    user: "What kind of analytics do you provide?",
    ai: "We provide detailed insights into user interactions, popular questions, satisfaction rates, and conversion metrics to help optimize your customer service 📊",
  },
  {
    user: "Is there a free trial available?",
    ai: "Yes! We offer a 14-day free trial with full access to all features. No credit card required to get started 🎉",
  },
  {
    user: "How do you handle sensitive data?",
    ai: "We take security seriously! All data is encrypted, and we're fully GDPR compliant. Plus, you can customize data retention policies 🔒",
  },
  {
    user: "Can I train the AI on specific responses?",
    ai: "Yes! You can easily train me with custom responses, upload documents, and set specific rules for handling certain types of questions 📚",
  },
  {
    user: "What's your uptime guarantee?",
    ai: "We maintain a 99.9% uptime guarantee with real-time monitoring and redundant systems to ensure reliability 🎯",
  },
  {
    user: "Do you integrate with my CRM?",
    ai: "We integrate with popular CRMs like Salesforce, HubSpot, and more. Plus, we have an API for custom integrations 🔄",
  },
  {
    user: "Can you handle high traffic volumes?",
    ai: "Our infrastructure automatically scales to handle any traffic volume, from small businesses to enterprise websites 🚀",
  },
  {
    user: "What about after-hours support?",
    ai: "I'm available 24/7 to help your customers, ensuring they get instant support even outside business hours 🌙",
  },
  {
    user: "Can you transfer to human agents?",
    ai: "Yes! I can seamlessly transfer complex queries to your human support team when needed, with full context preservation 🤝",
  },
  {
    user: "Do you support file attachments?",
    ai: "Yes! Users can share images and documents, and I can understand and respond to their content appropriately 📎",
  },
  {
    user: "What's your pricing model?",
    ai: "We offer flexible plans based on your needs, starting from $29/month. Volume discounts are available for larger businesses 💰",
  },
  {
    user: "How do you handle errors?",
    ai: "I'm designed to gracefully handle errors and always provide helpful responses. Plus, you get notifications about any issues 🛠️",
  },
  {
    user: "Can you help with lead generation?",
    ai: "Absolutely! I can collect qualified leads, schedule demos, and integrate with your sales pipeline to boost conversions 📈",
  },
];

function chatReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_TYPING_TEXT":
      return {
        ...state,
        currentTypingText: action.text,
      };
    case "SET_INPUT_TEXT":
      return {
        ...state,
        inputText: action.text,
      };
    case "COMPLETE_AI_TYPING":
      return {
        ...state,
        messages: [
          ...state.messages,
          { role: "ai", content: state.currentTypingText },
        ],
        currentTypingText: "",
        phase: "user_typing",
      };
    case "SUBMIT_USER_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, { role: "user", content: action.text }],
        inputText: "",
        phase: "ai_thinking",
      };
    case "START_AI_RESPONSE":
      return {
        ...state,
        phase: "ai_typing",
      };
    case "START_USER_TYPING":
      return {
        ...state,
        conversationIndex: state.conversationIndex + 1,
        phase: "user_typing",
      };
    default:
      return state;
  }
}

function useTypewriter(text: string, speed: number = 50) {
  const [state, setState] = useState({
    displayedText: "",
    isComplete: false,
  });

  useEffect(() => {
    // Reset state when text changes
    setState({
      displayedText: "",
      isComplete: false,
    });

    const length = text.length;
    let currentIndex = 0;
    let timeoutId: NodeJS.Timeout;

    const typeNextCharacter = () => {
      currentIndex++;
      setState({
        displayedText: text.slice(0, currentIndex),
        isComplete: currentIndex >= length,
      });

      if (currentIndex < length) {
        timeoutId = setTimeout(typeNextCharacter, speed);
      }
    };

    if (length > 0) {
      // Start the first character immediately
      setState({
        displayedText: text[0],
        isComplete: length === 1,
      });

      if (length > 1) {
        timeoutId = setTimeout(typeNextCharacter, speed);
      }
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [text, speed]);

  return {
    displayedText: state.displayedText,
    isComplete: state.isComplete,
  };
}

export function ChatPreview() {
  const [state, dispatch] = useReducer(chatReducer, {
    messages: [],
    inputText: "",
    currentTypingText: "",
    conversationIndex: 0,
    phase: "ai_typing",
  });

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const { displayedText, isComplete } = useTypewriter(
    state.currentTypingText,
    15
  );

  // Auto scroll effect
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [state.messages, displayedText]);

  // State machine effect
  useEffect(() => {
    if (state.conversationIndex >= DEMO_CONVERSATIONS.length) {
      // Reset to initial state after completing all conversations
      dispatch({
        type: "SET_TYPING_TEXT",
        text: WELCOME_MESSAGE,
      });
      return;
    }

    const conversation = DEMO_CONVERSATIONS[state.conversationIndex];

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    switch (state.phase) {
      case "ai_typing":
        // Start AI typing if no current text
        if (!state.currentTypingText) {
          dispatch({
            type: "SET_TYPING_TEXT",
            text:
              state.conversationIndex === 0 ? WELCOME_MESSAGE : conversation.ai,
          });
        }
        // When typing is complete, wait then move to user typing
        else if (isComplete) {
          timeoutRef.current = setTimeout(() => {
            dispatch({ type: "COMPLETE_AI_TYPING" });
            // Move to next conversation after AI message is complete
            dispatch({ type: "START_USER_TYPING" });
          }, 1000);
        }
        break;

      case "user_typing":
        // Start user typing simulation
        const simulateUserTyping = async () => {
          let typingText = "";
          for (let i = 0; i < conversation.user.length; i++) {
            await new Promise((resolve) => setTimeout(resolve, 25));
            typingText += conversation.user[i];
            dispatch({ type: "SET_INPUT_TEXT", text: typingText });
          }
          // After typing complete, wait then submit
          timeoutRef.current = setTimeout(() => {
            dispatch({ type: "SUBMIT_USER_MESSAGE", text: conversation.user });
          }, 1000);
        };
        simulateUserTyping();
        break;

      case "ai_thinking":
        // Show thinking animation, then start AI response
        timeoutRef.current = setTimeout(() => {
          dispatch({ type: "START_AI_RESPONSE" });
        }, 1000);
        break;
    }

    // Cleanup timeout on unmount or phase change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [
    state.phase,
    state.conversationIndex,
    state.currentTypingText,
    isComplete,
  ]);

  return (
    <div className="w-[380px] rounded-lg bg-white p-4 shadow-xl ring-1 ring-gray-200">
      <div className="flex items-center space-x-4 mb-4">
        <div className="h-10 w-10 rounded-full overflow-hidden">
          <img
            src={AI_AVATAR_URL}
            alt="AI Avatar"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="text-sm font-medium text-gray-900">
          Chatting with Site Sensei
        </div>
      </div>

      <div
        ref={chatContainerRef}
        className="space-y-4 h-[300px] overflow-y-auto mb-4 pointer-events-none"
      >
        {state.messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-end gap-4 ${
              message.role === "ai" ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`flex-1 ${
                message.role === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-900"
              } rounded-lg p-3 text-sm`}
            >
              {message.content}
            </div>
            <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={message.role === "user" ? USER_AVATAR_URL : AI_AVATAR_URL}
                alt={`${message.role === "user" ? "User" : "AI"} Avatar`}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        ))}

        {state.phase === "ai_typing" && state.currentTypingText && (
          <div className="flex items-end gap-4 flex-row-reverse">
            <div className="flex-1 bg-gray-100 text-gray-900 rounded-lg p-3 text-sm">
              {displayedText}
            </div>
            <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={AI_AVATAR_URL}
                alt="AI Avatar"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}

        {state.phase === "ai_thinking" && (
          <div className="flex items-end gap-4 flex-row-reverse">
            <div className="flex-1 bg-gray-100 text-gray-900 rounded-lg p-3 text-sm">
              <div className="flex items-center space-x-2">
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
            <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={AI_AVATAR_URL}
                alt="AI Avatar"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        <input
          type="text"
          className="w-full rounded-full border-gray-200 pl-4 pr-10 py-2 text-sm"
          placeholder="Type your message..."
          value={state.inputText}
          disabled
        />
        <button
          className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 ${
            state.inputText ? "bg-indigo-600" : "bg-gray-300"
          } text-white transition-colors`}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2 12l10 10L22 2"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
