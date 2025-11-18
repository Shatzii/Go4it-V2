import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0B0F14] to-[#05070b] py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#00D4FF] to-[#27E36A] bg-clip-text text-transparent">
            StarPath Platform
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-gray-300">
            Train Here. Learn Everywhere. Graduate Globally Competitive.
          </p>
          <p className="text-lg text-gray-400 mb-8 max-w-3xl mx-auto">
            The world's first integrated academic–athletic–language pathway for elite student-athletes.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href="/assessment" 
              className="px-8 py-4 bg-[#00D4FF] text-[#05070b] font-bold rounded-lg hover:bg-[#27E36A] transition-colors"
            >
              Take Assessment ($397)
            </Link>
            <Link 
              href="/programs" 
              className="px-8 py-4 border-2 border-[#00D4FF] text-[#00D4FF] font-bold rounded-lg hover:bg-[#00D4FF] hover:text-[#05070b] transition-colors"
            >
              View Programs
            </Link>
          </div>
        </div>
      </section>

      {/* Programs Overview */}
      <section className="py-20 px-4 bg-[#05070b]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-[#00D4FF]">
            Our Programs
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Online Accelerator */}
            <div className="bg-[#0B0F14] border border-gray-800 rounded-lg p-8 hover:border-[#00D4FF] transition-colors">
              <h3 className="text-2xl font-bold mb-3 text-[#00D4FF]">
                StarPath Online Accelerator
              </h3>
              <p className="text-3xl font-bold mb-4 text-[#27E36A]">
                $15,000<span className="text-lg text-gray-400">/semester</span>
              </p>
              <ul className="space-y-2 mb-6 text-gray-300">
                <li>✓ 10 NCAA-aligned credits in 12 weeks</li>
                <li>✓ Fully online with daily live instruction</li>
                <li>✓ AI video analysis & HDR tracking</li>
                <li>✓ College recruiting support</li>
              </ul>
              <Link 
                href="/programs/online-accelerator"
                className="block text-center px-6 py-3 border border-[#00D4FF] text-[#00D4FF] rounded-lg hover:bg-[#00D4FF] hover:text-[#05070b] transition-colors"
              >
                Learn More
              </Link>
            </div>

            {/* Vienna Residency */}
            <div className="bg-[#0B0F14] border border-gray-800 rounded-lg p-8 hover:border-[#27E36A] transition-colors">
              <h3 className="text-2xl font-bold mb-3 text-[#27E36A]">
                Vienna Global Residency
              </h3>
              <p className="text-3xl font-bold mb-4 text-[#00D4FF]">
                $28,000<span className="text-lg text-gray-400">/semester</span>
              </p>
              <ul className="space-y-2 mb-6 text-gray-300">
                <li>✓ 12 NCAA-aligned credits in 12 weeks</li>
                <li>✓ German A2 certification included</li>
                <li>✓ Housing + local transport included</li>
                <li>✓ Cultural immersion program</li>
              </ul>
              <Link 
                href="/programs/vienna-residency"
                className="block text-center px-6 py-3 border border-[#27E36A] text-[#27E36A] rounded-lg hover:bg-[#27E36A] hover:text-[#05070b] transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-[#0B0F14]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 text-[#27E36A]">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Contact our admissions team to discuss your pathway
          </p>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="bg-[#05070b] border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-3 text-[#00D4FF]">USA</h3>
              <p className="text-gray-300">📞 +1-303-970-4655</p>
              <p className="text-gray-400 text-sm">Denver, Colorado (MST)</p>
            </div>
            <div className="bg-[#05070b] border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-3 text-[#27E36A]">Europe</h3>
              <p className="text-gray-300">📞 +43-650-564-4236</p>
              <p className="text-gray-400 text-sm">Vienna, Austria (CET)</p>
            </div>
          </div>
          <p className="mt-6 text-gray-400">
            📧 info@go4itsports.org | 🌐 go4itsports.org
          </p>
        </div>
      </section>
    </div>
  );
}
