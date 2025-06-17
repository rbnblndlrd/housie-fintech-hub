
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
            className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 rounded-full w-16 h-16 shadow-lg flex items-center justify-center"
          >
            <img 
              src="/lovable-uploads/ceb92e4c-4980-45ea-945a-eff3e55c13d8.png" 
              alt="HOUSIE Assistant" 
              className="w-10 h-10 rounded-full object-cover"
            />
          </Button>
        ) : (
          <Card className="w-80 h-96 shadow-xl bg-white dark:bg-gray-800 border dark:border-gray-700">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src="/lovable-uploads/ceb92e4c-4980-45ea-945a-eff3e55c13d8.png" 
                    alt="HOUSIE Assistant" 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <CardTitle className="text-lg">Assistant HOUSIE</CardTitle>
                </div>
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
              <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-orange-50/20 to-purple-50/20 dark:from-gray-800 dark:to-gray-900">
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:bg-purple-900/50 rounded-lg p-3 border border-purple-200 dark:border-purple-700">
                    <div className="flex items-start gap-2">
                      <img 
                        src="/lovable-uploads/ceb92e4c-4980-45ea-945a-eff3e55c13d8.png" 
                        alt="HOUSIE Assistant" 
                        className="w-6 h-6 rounded-full object-cover flex-shrink-0 mt-1"
                      />
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        Salut! Je suis votre assistante HOUSIE. Prête à vous aider avec la conformité CRA 2025 partout au Canada. 🏠✨
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 ml-8">
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      Bonjour! Pouvez-vous m'aider à comprendre la conformité fiscale pour mon entreprise de nettoyage?
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:bg-purple-900/50 rounded-lg p-3 border border-purple-200 dark:border-purple-700">
                    <div className="flex items-start gap-2">
                      <img 
                        src="/lovable-uploads/ceb92e4c-4980-45ea-945a-eff3e55c13d8.png" 
                        alt="HOUSIE Assistant" 
                        className="w-6 h-6 rounded-full object-cover flex-shrink-0 mt-1"
                      />
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        Bien sûr! Pour les services de nettoyage au Canada, vous devez suivre tous les revenus et dépenses. HOUSIE catégorise automatiquement vos transactions et génère des rapports prêts pour l'ARC. Voulez-vous que je vous montre comment? 💼
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t dark:border-gray-600 bg-white dark:bg-gray-800">
                <div className="flex gap-2">
                  <Input
                    placeholder="Tapez votre message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <Button size="sm" className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
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
