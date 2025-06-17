
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen ? (
          <Button
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 rounded-full w-14 h-14 shadow-lg"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        ) : (
          <Card className="w-80 h-96 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">HOUSIE Assistant</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex flex-col h-80">
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  <div className="bg-purple-100 rounded-lg p-3">
                    <p className="text-sm">
                      Hello! I'm your HOUSIE assistant. Ready to help with CRA 2025 compliance across Canada.
                    </p>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 ml-8">
                    <p className="text-sm">
                      Hi! Can you help me understand tax compliance for my cleaning business?
                    </p>
                  </div>
                  <div className="bg-purple-100 rounded-lg p-3">
                    <p className="text-sm">
                      Absolutely! For cleaning services in Canada, you'll need to track all income and expenses. HOUSIE automatically categorizes your transactions and generates CRA-ready reports. Would you like me to show you how?
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};
