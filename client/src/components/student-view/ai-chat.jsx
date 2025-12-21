import { useState, useRef, useEffect } from "react";
import { fetchAIResponseService } from "@/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User, Send, Loader2, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function AIChat({ context, studentName }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("english");
  const scrollAreaRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    let greeting = "";
    const name = studentName || "Student";
    switch (language) {
      case "hindi":
        greeting = `नमस्ते ${name}! मैं आपका एआई शिक्षण सहायक हूँ। इस व्याख्यान के बारे में मुझसे कुछ भी पूछें!`;
        break;
      case "marathi":
        greeting = `नमस्कार ${name}! मी तुमचा AI शिक्षण सहाय्यक आहे. या व्याख्यानाबद्दल मला काहीही विचारा!`;
        break;
      default:
        greeting = `Hello ${name}! I'm your AI teaching assistant. Ask me anything about this lecture!`;
        break;
    }

    // Reset messages with new greeting when language changes
    setMessages([
        {
          role: "ai",
          content: greeting,
        },
    ]);
  }, [language, studentName]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  async function handleSendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetchAIResponseService(input, context, language);
      if (response?.success) {
        const aiMessage = { role: "ai", content: response.answer };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from AI. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-[600px] bg-background border rounded-lg overflow-hidden">
      <Card className="flex-1 flex flex-col border-0 shadow-none h-full">
        <CardHeader className="p-4 border-b flex flex-row items-center justify-between space-y-0 bg-muted/30">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Bot className="h-6 w-6 text-primary" />
            AI Assistant
          </CardTitle>
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[110px] h-8 text-sm">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="hindi">Hindi</SelectItem>
                <SelectItem value="marathi">Marathi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-hidden relative flex flex-col">
          <ScrollArea className="flex-1 w-full p-4">
            <div className="flex flex-col gap-6 pb-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 ${
                    msg.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <Avatar className="h-8 w-8 border">
                    <AvatarFallback
                      className={
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }
                    >
                      {msg.role === "user" ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`rounded-lg px-4 py-3 max-w-[85%] text-sm shadow-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 border text-foreground"
                    }`}
                  >
                    {msg.role === "ai" ? (
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                            p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                            li: ({node, ...props}) => <li className="" {...props} />,
                            h1: ({node, ...props}) => <h1 className="text-lg font-bold mb-2 mt-2" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-base font-bold mb-2 mt-2" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-sm font-bold mb-1 mt-2" {...props} />,
                            code: ({node, inline, className, children, ...props}) => {
                                return inline ? (
                                    <code className="bg-muted-foreground/20 rounded px-1 py-0.5 text-xs font-mono" {...props}>
                                        {children}
                                    </code>
                                ) : (
                                    <pre className="bg-muted-foreground/20 rounded p-2 overflow-x-auto text-xs font-mono mb-2">
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    </pre>
                                );
                            },
                             strong: ({node, ...props}) => <span className="font-bold" {...props} />,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-4">
                  <Avatar className="h-8 w-8 border">
                    <AvatarFallback className="bg-muted text-foreground">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted/50 border rounded-lg px-4 py-3">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
              <div ref={scrollAreaRef} />
            </div>
          </ScrollArea>
        </CardContent>
        <div className="p-4 border-t bg-background mt-auto">
          <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
            <Input
              placeholder={
                language === "hindi" 
                ? "अपना प्रश्न यहाँ लिखें..." 
                : language === "marathi" 
                ? "तुमचा प्रश्न येथे टाईप करा..." 
                : "Type your question..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1 focus-visible:ring-offset-0 focus-visible:ring-1"
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
              className="h-10 w-10 shrink-0"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}

export default AIChat;
