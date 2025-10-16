"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import {
  X,
  MessageCircle,
  Send,
  Loader2,
  ArrowDownCircleIcon, // You might still want this for closing, or just use X
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

import TalentPage from "@/components/TalentPage";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Chat() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  // We'll set showChatIcon to true by default, no scroll logic needed
  const [showChatIcon, setShowChatIcon] = useState(true); // <--- CHANGE 1: Set to true by default
  const chatIconRef = useRef<HTMLButtonElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);

  // Initialize conversationId on mount
  useEffect(() => {
    let id = localStorage.getItem("chatbot_conversation_id");
    if (!id) {
      id = uuidv4();
      localStorage.setItem("chatbot_conversation_id", id);
    }
    setConversationId(id);
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isChatOpen]);

  // <--- REMOVE OR COMMENT OUT THIS useEffect FOR SCROLLING --->
  // If you don't want any scroll-based logic for the icon, remove this.
  // If you want the chat window to close when scrolled to top, you could keep a modified version.
  /*
  useEffect(() => {
    const handleScroll = () => {
      // If you want the chat icon ALWAYS visible, you don't need this.
      // If you want the chat window to close when scrolled to top, but icon remains,
      // you could adjust this to: if (window.scrollY === 0) { setIsChatOpen(false); }
      if (window.scrollY > 0) {
        setShowChatIcon(true);
      } else {
        setShowChatIcon(false); // This would hide the icon if you scroll to top
        setIsChatOpen(false);
      }
    };
    // No initial handleScroll() here, as we set showChatIcon to true by default
    // window.addEventListener("scroll", handleScroll);
    // return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  */

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    // Optionally, if closing, reset conversation or clear messages
    if (isChatOpen) {
      // setMessages([]); // Uncomment to clear messages on close
      // localStorage.removeItem('chatbot_conversation_id'); // Uncomment to reset conversation ID on close
      // setConversationId(uuidv4()); // Uncomment to get new ID on close
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || !conversationId) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          role: userMessage.role,
          conversation_id: conversationId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || "Failed to fetch response from backend."
        );
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error("Chat error:", err);
      setError(err.message || "An unexpected error occurred.");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm sorry, an error occurred. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <TalentPage />

      <AnimatePresence>
        {/* showChatIcon is now true by default, so this will always render */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-4 right-4 z-[9999]"
        >
          <Button
            ref={chatIconRef}
            onClick={toggleChat}
            size="icon"
            className="rounded-full size-14 p-2 shadow-lg"
          >
            {!isChatOpen ? (
              <MessageCircle className="size-12" />
            ) : (
              <X className="size-6" />
            )}
          </Button>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 z-[9999]"
          >
            <Card className="border-2 flex flex-col flex-grow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-lg font-bold">
                  Chat with AI
                </CardTitle>
                <Button
                  onClick={toggleChat}
                  size="icon"
                  variant="ghost"
                  className="px-2 py-8"
                >
                  <X className="size-6" />
                  <span className="sr-only">Close chat</span>
                </Button>
              </CardHeader>
              <CardContent className="flex-grow overflow-hidden">
                <ScrollArea className="h-full pr-4">
                  {messages?.length === 0 && (
                    <div className="w-full mt-32 text-gray-500 items-center justify-center flex gap-3">
                      No message yet.
                    </div>
                  )}
                  {messages?.map((message, index) => (
                    <div
                      key={index}
                      className={`mb-2 p-2 rounded-lg max-w-[80%] ${
                        message.role === "user"
                          ? "bg-blue-500 text-white ml-auto"
                          : "bg-gray-200 text-gray-800 mr-auto"
                      }`}
                    >
                      <ReactMarkdown
                        children={message.content}
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code({
                            node,
                            inline,
                            className,
                            children,
                            ...props
                          }) {
                            const match = /language-(\w+)/.exec(
                              className || ""
                            );
                            return !inline && match ? (
                              <pre
                                {...props}
                                className="bg-gray-800 p-2 rounded text-white overflow-x-auto"
                              >
                                <code>{children}</code>
                              </pre>
                            ) : (
                              <code
                                {...props}
                                className="bg-gray-300 px-1 rounded text-gray-800"
                              >
                                {children}
                              </code>
                            );
                          },
                          ul: ({ children }) => (
                            <ul className="list-disc ml-4">{children}</ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal ml-4">{children}</ol>
                          ),
                          p: ({ children }) => (
                            <p className="mb-1">{children}</p>
                          ),
                        }}
                      />
                    </div>
                  ))}
                  {isLoading && (
                    <div className="w-full items-center flex justify-center gap-3 mt-2">
                      <Loader2 className="animate-spin h-5 w-5 text-primary" />
                    </div>
                  )}
                  {error && (
                    <div className="w-full items-center flex justify-center gap-3 text-red-500 mt-2">
                      <div>An error occurred: {error}</div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </ScrollArea>
              </CardContent>
              <CardFooter>
                <form
                  onSubmit={handleSubmit}
                  className="w-full flex items-center space-x-2"
                >
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type your message here..."
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    className="size-9"
                    disabled={isLoading || !input.trim()}
                    size="icon"
                  >
                    <Send className="size-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
