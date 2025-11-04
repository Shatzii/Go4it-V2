'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, Clock, FileCheck, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AuditPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Clock className="w-4 h-4" />
            <span>48-Hour Turnaround Guaranteed</span>
          </div>
          
          <h1 className="text-5xl font-black mb-6">
            NCAA Credit Audit
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Get a comprehensive analysis of your academic eligibility for NCAA athletics. 
            We'll review your transcripts, identify gaps, and create an action plan—all within 48 hours.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => router.push('/audit/book')}
              className="text-lg px-8 py-6"
            >
              Book Your Audit Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => router.push('/ncaa-eligibility')}
              className="text-lg px-8 py-6"
            >
              Learn About NCAA Rules
            </Button>
          </div>
        </div>

        {/* What You Get */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">What's Included</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <FileCheck className="w-10 h-10 text-blue-600 mb-2" />
                <CardTitle className="text-lg">Transcript Review</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Complete analysis of your academic records against NCAA core course requirements.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <AlertCircle className="w-10 h-10 text-orange-600 mb-2" />
                <CardTitle className="text-lg">Gap Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Identify missing core courses and areas that need attention before graduation.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="w-10 h-10 text-green-600 mb-2" />
                <CardTitle className="text-lg">GPA Calculation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  NCAA GPA calculation based on approved core courses and sliding scale requirements.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CheckCircle className="w-10 h-10 text-purple-600 mb-2" />
                <CardTitle className="text-lg">Action Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Step-by-step roadmap with deadlines to ensure you meet all eligibility requirements.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Process Timeline */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Submit Your Transcripts</h3>
                <p className="text-gray-600">
                  Upload unofficial transcripts from all high schools attended. Include any dual enrollment or online courses.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Expert Review (24-48 Hours)</h3>
                <p className="text-gray-600">
                  Our NCAA compliance specialists analyze your coursework against Division I, II, and III requirements.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Receive Your Report</h3>
                <p className="text-gray-600">
                  Get a comprehensive PDF report with your current status, gaps, GPA calculation, and next steps.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Implementation Support</h3>
                <p className="text-gray-600">
                  Optional: We can help you execute the plan, whether that's enrolling in our academy or guiding your current school.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="max-w-2xl mx-auto mb-16">
          <Card className="border-2 border-blue-600">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-2">48-Hour Credit Audit</CardTitle>
              <CardDescription className="text-lg">
                Investment: <span className="text-4xl font-bold text-blue-600">$297</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Complete transcript analysis (all schools, online courses, dual enrollment)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>NCAA core course verification for DI, DII, and DIII</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>GPA calculation with sliding scale projections</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Gap analysis and missing course identification</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Customized action plan with deadlines</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>30-minute consultation call to review findings</span>
                </li>
              </ul>
              
              <Button 
                className="w-full py-6 text-lg"
                onClick={() => router.push('/audit/book')}
              >
                Book Your Audit Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              <p className="text-center text-sm text-gray-500 mt-4">
                100% Money-Back Guarantee if not delivered within 48 hours
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Who Needs This */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Who Needs This Audit?</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>International Athletes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Not sure if your home country coursework translates to NCAA core courses? 
                  We'll evaluate and advise on what additional courses you need.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Homeschool Students</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Ensure your homeschool curriculum meets NCAA standards and understand 
                  what documentation you'll need for the Eligibility Center.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transfer Students</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Changed schools multiple times? We'll consolidate all transcripts and 
                  identify any gaps or duplicate courses.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Late Bloomers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Didn't focus on athletics early? Find out where you stand and what 
                  you can still do to become NCAA eligible.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Footer */}
        <div className="max-w-4xl mx-auto mt-16 text-center">
          <div className="bg-blue-50 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">
              Don't Leave Your Eligibility to Chance
            </h3>
            <p className="text-gray-600 mb-6">
              Many athletes find out too late that they're missing core courses or don't meet GPA requirements. 
              Get peace of mind with a professional audit.
            </p>
            <Button 
              size="lg"
              onClick={() => router.push('/audit/book')}
              className="text-lg px-8 py-6"
            >
              Start Your Audit
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
