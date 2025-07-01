import { FaMicrosoft, FaGoogle, FaAmazon, FaSlack, FaSpotify, FaAirbnb } from "react-icons/fa";

export default function TrustedBy() {
  const companies = [
    { name: "Microsoft", icon: FaMicrosoft },
    { name: "Google", icon: FaGoogle },
    { name: "Amazon", icon: FaAmazon },
    { name: "Slack", icon: FaSlack },
    { name: "Spotify", icon: FaSpotify },
    { name: "Airbnb", icon: FaAirbnb },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-gray-600 mb-8">Trusted by 500+ companies worldwide</p>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center opacity-60">
          {companies.map((company) => (
            <div key={company.name} className="text-center">
              <company.icon className="text-3xl mx-auto text-gray-600" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
