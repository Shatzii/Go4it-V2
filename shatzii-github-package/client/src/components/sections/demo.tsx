import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Demo() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    { id: "dashboard", label: "Dashboard Overview" },
    { id: "cms", label: "CMS Interface" },
    { id: "deployment", label: "Deployment Flow" },
  ];

  const demoContent = {
    dashboard: {
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=700",
      alt: "Modern SaaS dashboard interface",
      features: [
        {
          title: "Real-time Analytics",
          description: "Monitor your application performance and user engagement"
        },
        {
          title: "Custom Metrics",
          description: "Track custom events and conversion funnels"
        },
        {
          title: "Team Collaboration",
          description: "Share insights and work together seamlessly"
        }
      ]
    },
    cms: {
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=700",
      alt: "CMS interface showing content management",
      features: [
        {
          title: "Content Management",
          description: "Easy-to-use interface for managing all your content"
        },
        {
          title: "Custom Fields",
          description: "Create custom field types for any data structure"
        },
        {
          title: "API Generation",
          description: "Automatic REST and GraphQL API generation"
        }
      ]
    },
    deployment: {
      image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=700",
      alt: "Deployment pipeline visualization",
      features: [
        {
          title: "Continuous Deployment",
          description: "Automatic deployments on every commit"
        },
        {
          title: "Preview Environments",
          description: "Test changes in isolated preview environments"
        },
        {
          title: "Global Distribution",
          description: "Deploy to edge locations worldwide"
        }
      ]
    }
  };

  const currentDemo = demoContent[activeTab as keyof typeof demoContent];

  return (
    <section id="demo" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">See It in Action</h2>
          <p className="text-xl text-gray-600">Explore our platform with interactive demos</p>
        </div>

        <Card className="overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant="ghost"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-medium rounded-none border-b-2 ${
                    activeTab === tab.id
                      ? "text-blue-600 border-blue-600"
                      : "text-gray-500 border-transparent hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </Button>
              ))}
            </nav>
          </div>

          <CardContent className="p-8">
            <div className="demo-content">
              <img
                src={currentDemo.image}
                alt={currentDemo.alt}
                className="rounded-lg shadow-lg w-full mb-6"
              />
              <div className="grid md:grid-cols-3 gap-6">
                {currentDemo.features.map((feature, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
