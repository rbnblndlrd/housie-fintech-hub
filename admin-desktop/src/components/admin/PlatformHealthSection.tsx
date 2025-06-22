
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Activity, Server, Database, Wifi, Cpu, HardDrive } from "lucide-react";

const PlatformHealthSection = () => {
  const healthMetrics = {
    uptime: "99.9%",
    responseTime: "145ms",
    errorRate: "0.02%",
    activeConnections: 1234,
    cpuUsage: 45,
    memoryUsage: 62,
    diskUsage: 78
  };

  const services = [
    { name: "API Gateway", status: "healthy", responseTime: "120ms", uptime: "100%" },
    { name: "Database", status: "healthy", responseTime: "8ms", uptime: "99.9%" },
    { name: "File Storage", status: "warning", responseTime: "230ms", uptime: "99.8%" },
    { name: "Email Service", status: "healthy", responseTime: "450ms", uptime: "100%" },
    { name: "Payment Gateway", status: "healthy", responseTime: "180ms", uptime: "99.9%" }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Platform Health
          <Badge variant="default">All Systems Operational</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Uptime</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{healthMetrics.uptime}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Response Time</span>
            </div>
            <p className="text-2xl font-bold">{healthMetrics.responseTime}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-muted-foreground">Error Rate</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{healthMetrics.errorRate}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-muted-foreground">Active Connections</span>
            </div>
            <p className="text-2xl font-bold">{healthMetrics.activeConnections.toLocaleString()}</p>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Resource Usage</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4" />
                  <span className="text-sm">CPU Usage</span>
                </div>
                <span className="text-sm font-medium">{healthMetrics.cpuUsage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${healthMetrics.cpuUsage}%` }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  <span className="text-sm">Memory Usage</span>
                </div>
                <span className="text-sm font-medium">{healthMetrics.memoryUsage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${healthMetrics.memoryUsage}%` }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4" />
                  <span className="text-sm">Disk Usage</span>
                </div>
                <span className="text-sm font-medium">{healthMetrics.diskUsage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-600 h-2 rounded-full" 
                  style={{ width: `${healthMetrics.diskUsage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Service Status</h4>
          <div className="space-y-3">
            {services.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    service.status === 'healthy' ? 'bg-green-500' : 
                    service.status === 'warning' ? 'bg-orange-500' : 'bg-red-500'
                  }`}></div>
                  <span className="font-medium">{service.name}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{service.responseTime}</span>
                  <span>{service.uptime} uptime</span>
                  <Badge variant={service.status === 'healthy' ? 'default' : 'secondary'}>
                    {service.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlatformHealthSection;
