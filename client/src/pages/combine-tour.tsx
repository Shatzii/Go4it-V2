
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";

export default function CombineTourPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-blue-600 text-transparent bg-clip-text">
          GET VERIFIED COMBINE TOUR
        </h1>
        <p className="text-xl mb-8 max-w-3xl mx-auto text-gray-300">
          The Future of Athlete Evaluation & Placement
        </p>
      </section>

      {/* GAR Rating System */}
      <section className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">What is GAR Rating?</h2>
            <h3 className="text-xl mb-4">The 3-Part GAR System</h3>
            <div className="space-y-6">
              <Card className="bg-blue-600/10 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-blue-400">Physical (60%)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Sprint (40yd) + Agility+ Shuttle, Vertical + Broad + Pushups / Strength + Reaction Time Balance & Coordination
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-purple-600/10 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-purple-400">Cognitive (20%)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Tap Speed & Memory + Decision-Making IQ + Learning Style: Visual / Auditory / Kinesthetic Instruction Preference
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-green-600/10 border-green-500/20">
                <CardHeader>
                  <CardTitle className="text-green-400">Psychological (20%)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Confidence & Coachability + Risk Profile & Emotional Triggers + Team vs Solo Preference + Motivational Type + Personality Archetype (e.g., Warrior, Analyst)
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="relative">
            <img 
              src="/assets/gar-athletes.jpg" 
              alt="Athletes at Combine" 
              className="rounded-lg shadow-2xl"
            />
            <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-4 rounded-lg shadow-xl">
              <div className="text-3xl font-bold">89.1</div>
              <div className="text-sm">GAR Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* GAR Score Explanation */}
      <section className="mb-16">
        <div className="p-6 bg-gradient-to-r from-blue-900/50 to-blue-800/50 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">GAR Score = Physical Ability + Mental Sharpness + Resilience</h2>
          <p className="text-xl text-gray-300">
            The Go4it Athletic Rating (GAR) is a dynamic scientifically backed multi-dimensional wholistic system that scores more than physical stats. Our system captures mental, emotional and learning traits to provide the most complete rating known to date.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center">
        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-500">
          <Link href="/auth">Get Your GAR Rating</Link>
        </Button>
      </section>

      {/* Contact Info */}
      <footer className="mt-16 grid grid-cols-3 gap-4 text-center text-gray-400 text-sm">
        <div>
          <a href="tel:+12054344805" className="hover:text-blue-400">+1 (205) 434-8405</a>
        </div>
        <div>
          <a href="https://www.go4itsports.org" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
            www.go4itsports.org
          </a>
        </div>
        <div>
          18121 E Hampden Ave, Aurora, Colorado
        </div>
      </footer>
    </div>
  );
}
