'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/programs')
      .then(res => res.json())
      .then(data => setPrograms(data.programs || []))
      .catch(err => console.error('Failed to fetch programs:', err));
  }, []);

  return (
    <div className="min-h-screen bg-[#05070b] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-[#00D4FF] hover:text-[#27E36A] mb-8 inline-block">
          ← Back to Home
        </Link>

        <h1 className="text-5xl font-bold mb-4 text-center bg-gradient-to-r from-[#00D4FF] to-[#27E36A] bg-clip-text text-transparent">
          StarPath Programs
        </h1>
        <p className="text-xl text-center text-gray-400 mb-12">
          Choose your pathway to academic and athletic excellence
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {programs.map((program) => (
            <div
              key={program.id}
              className="bg-[#0B0F14] border border-gray-800 rounded-lg p-8 hover:border-[#00D4FF] transition-colors"
            >
              <h2 className="text-2xl font-bold mb-3 text-[#00D4FF]">
                {program.name}
              </h2>
              <p className="text-3xl font-bold mb-4 text-[#27E36A]">
                {program.price}
              </p>
              <p className="text-gray-300 mb-6">{program.description}</p>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-200">Features:</h3>
                <ul className="space-y-2 text-gray-300">
                  {program.features?.map((feature: string, i: number) => (
                    <li key={i}>✓ {feature}</li>
                  ))}
                </ul>
              </div>

              <Link
                href={`/programs/${program.id}`}
                className="block text-center px-6 py-3 bg-[#00D4FF] text-[#05070b] font-bold rounded-lg hover:bg-[#27E36A] transition-colors"
              >
                Learn More
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
