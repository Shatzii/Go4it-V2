export default function About() {
  const stats = [
    { number: "500+", label: "Servers Under AI Management" },
    { number: "99.9%", label: "AI Uptime Guarantee" },
    { number: "24/7", label: "Local AI Monitoring" },
    { number: "$50k+", label: "API Costs Saved Monthly" },
  ];

  return (
    <section id="about" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              AI That Actually Saves You Money
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              While others charge for every AI request, our local AI engine works completely offline. 
              No internet required, no API fees - just intelligent server management that gets smarter over time.
            </p>
            <div className="grid sm:grid-cols-2 gap-8">
              {stats.map((stat, index) => (
                <div key={index}>
                  <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
              alt="Software development team collaborating"
              className="rounded-xl shadow-2xl w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
