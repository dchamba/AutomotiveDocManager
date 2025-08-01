import { useState } from "react";
import { useLocation } from "wouter";
import { Link } from "wouter";
import { 
  BarChart3, Building2, Package, GitBranch, 
  BarChart, FileSpreadsheet, Settings, FileText, 
  ChevronLeft, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    name: "Anagrafica Clienti",
    href: "/clients",
    icon: Building2,
  },
  {
    name: "Catalogo Prodotti",
    href: "/products",
    icon: Package,
  },
];

const documentItems = [
  {
    name: "Flow Chart",
    href: "/flowchart",
    icon: GitBranch,
  },
  {
    name: "FMEA",
    href: "/fmea",
    icon: BarChart,
  },
  {
    name: "Control Plan",
    href: "/control-plan",
    icon: FileSpreadsheet,
  },
];

const otherItems = [
  {
    name: "Reports",
    href: "/reports",
    icon: FileText,
  },
  {
    name: "Impostazioni",
    href: "/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  onCollapseChange?: (collapsed: boolean) => void;
}

export function Sidebar({ onCollapseChange }: SidebarProps) {
  const [location] = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onCollapseChange?.(newState);
  };

  const renderNavItem = (item: any, isActive: boolean) => {
    const Icon = item.icon;
    return (
      <Link href={item.href} className={cn(
        "w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors",
        isCollapsed ? "justify-center" : "space-x-3",
        isActive 
          ? "bg-automotive-blue text-white" 
          : "text-gray-700 hover:bg-gray-100"
      )}>
        <Icon className="h-5 w-5 flex-shrink-0" />
        {!isCollapsed && <span className="font-medium">{item.name}</span>}
      </Link>
    );
  };

  return (
    <nav className={cn(
      "bg-white shadow-sm border-r border-gray-200 overflow-y-auto transition-all duration-300 fixed left-0 top-16 h-[calc(100vh-4rem)] z-40",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 h-full flex flex-col">
        {/* Header */}
        {!isCollapsed && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800">AutoDoc Pro</h2>
          </div>
        )}

        <ul className="space-y-2 flex-1">
          {navigationItems.map((item) => {
            const isActive = location === item.href || (item.href === "/dashboard" && location === "/");
            return (
              <li key={item.href}>
                {renderNavItem(item, isActive)}
              </li>
            );
          })}
          
          {!isCollapsed && (
            <li>
              <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Documenti
              </div>
            </li>
          )}
          
          {documentItems.map((item) => {
            const isActive = location === item.href;
            return (
              <li key={item.href}>
                {renderNavItem(item, isActive)}
              </li>
            );
          })}
          
          {otherItems.map((item) => {
            const isActive = location === item.href;
            return (
              <li key={item.href}>
                {renderNavItem(item, isActive)}
              </li>
            );
          })}
        </ul>
        
        {/* Toggle Button at Bottom */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggle}
            className={cn(
              "w-full p-2 hover:bg-gray-100 flex items-center",
              isCollapsed ? "justify-center" : "justify-end"
            )}
            title={isCollapsed ? "Espandi menu" : "Riduci menu"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span className="text-sm">Riduci</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
}