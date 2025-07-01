import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { 
  Shield, 
  Home, 
  AlertTriangle, 
  FileText, 
  Network, 
  BarChart3, 
  Settings,
  Users,
  Circle,
  Bell
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Client } from "@/types/security";

const navigationItems = [
  { path: "/", icon: Home, label: "Dashboard", adminOnly: false },
  { path: "/threats", icon: AlertTriangle, label: "Threats", adminOnly: false },
  { path: "/logs", icon: FileText, label: "Logs", adminOnly: false },
  { path: "/network", icon: Network, label: "Network", adminOnly: false },
  { path: "/notifications", icon: Bell, label: "Notifications", adminOnly: false },
  { path: "/admin", icon: Users, label: "Admin", adminOnly: true },
];

export function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  const { data: clients } = useQuery({
    queryKey: ["/api/admin/clients"],
    enabled: user?.role === "admin",
  });

  const systemStatus = [
    { name: "AI Engine", status: "online" },
    { name: "Monitoring", status: "online" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-security-green";
      case "offline":
        return "bg-gray-500";
      case "warning":
        return "bg-security-amber";
      default:
        return "bg-security-red";
    }
  };

  return (
    <div className="w-64 bg-navy-900 border-r border-gray-700 fixed h-full z-10">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-security-blue rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Sentinel AI</h1>
            <p className="text-xs text-gray-400">Cybersecurity Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6">
        <div className="px-3">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              if (item.adminOnly && user?.role !== "admin") {
                return null;
              }

              const isActive = location === item.path || 
                (item.path === "/" && location === "/dashboard");

              return (
                <Link key={item.path} href={item.path}>
                  <a className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "text-white bg-security-blue"
                      : "text-gray-300 hover:text-white hover:bg-navy-800"
                  }`}>
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </a>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Client Selection - Only show for non-admin users or when admin has clients */}
        {(user?.role !== "admin" || clients?.length > 0) && (
          <div className="px-3 mt-8">
            <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Clients
            </h3>
            <div className="mt-3 space-y-1">
              <Select>
                <SelectTrigger className="w-full bg-navy-800 border-gray-600 text-white">
                  <SelectValue placeholder={
                    user?.role === "admin" ? "Select Client" : "Acme Corp"
                  } />
                </SelectTrigger>
                <SelectContent className="bg-navy-800 border-gray-600">
                  {user?.role === "admin" && clients ? (
                    clients.map((client: Client) => (
                      <SelectItem key={client.id} value={client.id.toString()}>
                        {client.name}
                      </SelectItem>
                    ))
                  ) : (
                    <>
                      <SelectItem value="acme">Acme Corp</SelectItem>
                      <SelectItem value="techstart">TechStart Inc</SelectItem>
                      <SelectItem value="global">Global Finance</SelectItem>
                      <SelectItem value="healthcare">Healthcare Plus</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* System Status */}
        <div className="px-3 mt-8">
          <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            System Status
          </h3>
          <div className="mt-3 space-y-2">
            {systemStatus.map((system) => (
              <div key={system.name} className="flex items-center justify-between px-3 py-2">
                <span className="text-sm text-gray-300">{system.name}</span>
                <span className="flex items-center">
                  <Circle className={`w-2 h-2 ${getStatusColor(system.status)} rounded-full mr-2`} />
                  <span className={`text-xs capitalize ${
                    system.status === "online" ? "text-security-green" : "text-gray-400"
                  }`}>
                    {system.status}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
