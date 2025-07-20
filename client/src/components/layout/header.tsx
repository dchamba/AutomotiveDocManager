import { Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-automotive-blue text-white shadow-lg">
      <div className="max-w-full px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Settings className="h-6 w-6" />
              <h1 className="text-xl font-medium">AutoDoc Pro</h1>
              <span className="text-xs bg-automotive-orange px-2 py-1 rounded">AIAG-VDA</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative p-2 hover:bg-blue-700 rounded-lg transition-colors text-white hover:text-white"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-automotive-error text-xs w-5 h-5 rounded-full flex items-center justify-center">
                3
              </span>
            </Button>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-automotive-orange rounded-full flex items-center justify-center font-medium">
                MR
              </div>
              <div className="text-sm">
                <div>Mario Rossi</div>
                <div className="text-blue-200 text-xs">Quality Manager</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
