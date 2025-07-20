import { useLocation } from "wouter";
import { Link } from "wouter";
import { 
  BarChart3, Building2, Package, GitBranch, 
  BarChart, FileSpreadsheet, Settings, FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

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

export function Sidebar() {
  const [location] = useLocation();

  return (
    <nav className="w-64 bg-white shadow-sm border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || (item.href === "/dashboard" && location === "/");
            
            return (
              <li key={item.href}>
                <Link href={item.href} className={cn(
                  "w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors",
                  isActive 
                    ? "bg-automotive-blue text-white" 
                    : "text-gray-700 hover:bg-gray-100"
                )}>
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
          
          <li>
            <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
              Documenti
            </div>
            <ul className="mt-2 space-y-1">
              {documentItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href;
                
                return (
                  <li key={item.href}>
                    <Link href={item.href} className={cn(
                      "w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors",
                      isActive 
                        ? "bg-automotive-blue text-white" 
                        : "text-gray-700 hover:bg-gray-100"
                    )}>
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
          
          {otherItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <li key={item.href}>
                <Link href={item.href} className={cn(
                  "w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors",
                  isActive 
                    ? "bg-automotive-blue text-white" 
                    : "text-gray-700 hover:bg-gray-100"
                )}>
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
