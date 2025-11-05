/**
 * Mobile Drill Browser
 * Path: /m/drills
 * 
 * ZONE: GREEN (public drill library)
 * 
 * Mobile-optimized drill browsing with:
 * - Quick filters
 * - Touch-friendly cards
 * - Video previews
 * - Save to favorites
 */

import { DrillBrowser } from '@/components/drills/DrillBrowser';

export const metadata = {
  title: 'Drill Library | Go4it Sports Academy',
  description: 'Browse training drills for all sports',
};

export default function MobileDrillsPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Mobile-optimized header */}
      <header className="bg-primary text-primary-foreground p-6 pb-8 rounded-b-3xl mb-6">
        <h1 className="text-2xl font-bold">Drill Library</h1>
        <p className="text-primary-foreground/80">Discover new training drills</p>
      </header>

      <div className="px-4">
        <DrillBrowser mode="library" />
      </div>

      {/* Bottom Navigation Spacer */}
      <div className="h-20" />
    </div>
  );
}
