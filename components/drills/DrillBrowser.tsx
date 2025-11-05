/**
 * DrillBrowser Component - Search and Browse Training Drills
 * 
 * ZONE: Hybrid (GREEN for public library, RED for personalized recommendations)
 * 
 * Features:
 * - Filter by sport, category, skill level, position
 * - Search by keywords
 * - Semantic search via embeddings (when available)
 * - Video preview
 * - Drill details modal
 * - Assignment tracking (RED zone)
 * 
 * Used in:
 * - /dashboard - View assigned drills
 * - /starpath/training/[skillId] - Browse GAR-specific drills
 * - /m/drills - Mobile drill browser
 * - /admin/content - Content management
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Play, Star, Clock, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Sport configurations
const SPORTS = [
  { value: 'all', label: 'All Sports' },
  { value: 'football', label: 'Football' },
  { value: 'basketball', label: 'Basketball' },
  { value: 'soccer', label: 'Soccer' },
  { value: 'ski_jumping', label: 'Ski Jumping' },
  { value: 'flag_football', label: 'Flag Football' },
];

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'strength', label: 'Strength' },
  { value: 'speed', label: 'Speed' },
  { value: 'agility', label: 'Agility' },
  { value: 'skill', label: 'Skill' },
  { value: 'technique', label: 'Technique' },
  { value: 'conditioning', label: 'Conditioning' },
];

const SKILL_LEVELS = [
  { value: 'all', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'elite', label: 'Elite' },
];

interface DrillBrowserProps {
  mode?: 'library' | 'assigned' | 'recommended';
  athleteId?: string; // For RED zone personalized view
  garComponent?: string; // Filter by GAR component
  onDrillSelect?: (drill: Drill) => void;
  showAssignButton?: boolean;
}

interface Drill {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  sport: string;
  category: string;
  skillLevel: string;
  position?: string;
  garComponent?: string;
  primaryVideoId?: string;
  thumbnailUrl?: string;
  duration?: number;
  difficulty: number;
  xpReward: number;
  equipment?: string[];
  viewCount: number;
  completionCount: number;
  averageRating?: number;
  ratingCount: number;
  isFeatured: boolean;
  // Assignment info (RED zone)
  assignmentId?: string;
  assignmentStatus?: 'assigned' | 'in_progress' | 'completed';
  dueDate?: string;
}

export function DrillBrowser({
  mode = 'library',
  athleteId,
  garComponent,
  onDrillSelect,
  showAssignButton = false,
}: DrillBrowserProps) {
  const [drills, setDrills] = useState<Drill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedDrill, setSelectedDrill] = useState<Drill | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch drills based on mode
  useEffect(() => {
    fetchDrills();
  }, [mode, athleteId, garComponent, selectedSport, selectedCategory, selectedLevel]);

  async function fetchDrills() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (mode === 'assigned' && athleteId) {
        params.append('athleteId', athleteId);
        params.append('mode', 'assigned');
      } else if (mode === 'recommended' && athleteId) {
        params.append('athleteId', athleteId);
        params.append('mode', 'recommended');
      } else {
        params.append('mode', 'library');
        params.append('isPublic', 'true');
      }

      if (garComponent) params.append('garComponent', garComponent);
      if (selectedSport !== 'all') params.append('sport', selectedSport);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedLevel !== 'all') params.append('skillLevel', selectedLevel);

      const response = await fetch(`/api/drills?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setDrills(data.drills || []);
      }
    } catch (error) {
      console.error('Failed to fetch drills:', error);
    } finally {
      setLoading(false);
    }
  }

  // Filter drills by search query
  const filteredDrills = useMemo(() => {
    if (!searchQuery.trim()) return drills;

    const query = searchQuery.toLowerCase();
    return drills.filter(drill =>
      drill.title.toLowerCase().includes(query) ||
      drill.description.toLowerCase().includes(query) ||
      drill.sport.toLowerCase().includes(query) ||
      drill.category.toLowerCase().includes(query) ||
      drill.equipment?.some(eq => eq.toLowerCase().includes(query))
    );
  }, [drills, searchQuery]);

  // Open drill details modal
  function openDrillDetails(drill: Drill) {
    setSelectedDrill(drill);
  }

  // Handle drill selection
  function handleDrillSelect(drill: Drill) {
    if (onDrillSelect) {
      onDrillSelect(drill);
    } else {
      openDrillDetails(drill);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            {mode === 'assigned' && '📋 Assigned Drills'}
            {mode === 'recommended' && '⭐ Recommended for You'}
            {mode === 'library' && '📚 Drill Library'}
          </h2>
          <p className="text-muted-foreground">
            {filteredDrills.length} {filteredDrills.length === 1 ? 'drill' : 'drills'} available
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search drills, skills, equipment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Controls */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <label className="text-sm font-medium mb-2 block">Sport</label>
              <Select value={selectedSport} onValueChange={setSelectedSport}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SPORTS.map(sport => (
                    <SelectItem key={sport.value} value={sport.value}>
                      {sport.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Skill Level</label>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SKILL_LEVELS.map(level => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Drill Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      ) : filteredDrills.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No drills found matching your criteria.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedSport('all');
                setSelectedCategory('all');
                setSelectedLevel('all');
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrills.map(drill => (
            <DrillCard
              key={drill.id}
              drill={drill}
              onClick={() => handleDrillSelect(drill)}
              showAssignButton={showAssignButton}
            />
          ))}
        </div>
      )}

      {/* Drill Details Modal */}
      {selectedDrill && (
        <DrillDetailsModal
          drill={selectedDrill}
          open={!!selectedDrill}
          onClose={() => setSelectedDrill(null)}
          athleteId={athleteId}
        />
      )}
    </div>
  );
}

// Drill Card Component
function DrillCard({ drill, onClick, showAssignButton }: { drill: Drill; onClick: () => void; showAssignButton: boolean }) {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      {/* Thumbnail */}
      <div className="relative h-48 bg-muted overflow-hidden">
        {drill.thumbnailUrl ? (
          <img src={drill.thumbnailUrl} alt={drill.title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Play className="h-16 w-16 text-muted-foreground" />
          </div>
        )}
        {drill.isFeatured && (
          <Badge className="absolute top-2 right-2 bg-yellow-500">
            <Star className="h-3 w-3 mr-1" />
            Featured
          </Badge>
        )}
        {drill.assignmentStatus && (
          <Badge
            className={`absolute top-2 left-2 ${
              drill.assignmentStatus === 'completed'
                ? 'bg-green-500'
                : drill.assignmentStatus === 'in_progress'
                ? 'bg-blue-500'
                : 'bg-gray-500'
            }`}
          >
            {drill.assignmentStatus === 'completed' ? '✓ Done' : drill.assignmentStatus === 'in_progress' ? '▶ In Progress' : '📋 Assigned'}
          </Badge>
        )}
      </div>

      <CardHeader>
        <CardTitle className="text-lg line-clamp-2">{drill.title}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2">{drill.shortDescription || drill.description}</p>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{drill.sport}</Badge>
          <Badge variant="outline">{drill.category}</Badge>
          <Badge variant="outline">{drill.skillLevel}</Badge>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {drill.duration ? `${drill.duration}min` : 'N/A'}
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            {drill.xpReward} XP
          </div>
          {drill.averageRating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              {drill.averageRating.toFixed(1)}
            </div>
          )}
        </div>

        {/* Equipment */}
        {drill.equipment && drill.equipment.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Equipment: {drill.equipment.slice(0, 3).join(', ')}
            {drill.equipment.length > 3 && '...'}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// Drill Details Modal (placeholder - would be expanded)
function DrillDetailsModal({
  drill,
  open,
  onClose,
  athleteId,
}: {
  drill: Drill;
  open: boolean;
  onClose: () => void;
  athleteId?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{drill.title}</DialogTitle>
          <DialogDescription>{drill.sport} • {drill.category} • {drill.skillLevel}</DialogDescription>
        </DialogHeader>

        {/* Video Player */}
        {drill.primaryVideoId && (
          <div className="aspect-video bg-black rounded-lg">
            <video controls className="w-full h-full">
              <source src={`/api/media/${drill.primaryVideoId}`} type="video/mp4" />
            </video>
          </div>
        )}

        {/* Description */}
        <div>
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-muted-foreground">{drill.description}</p>
        </div>

        {/* Equipment */}
        {drill.equipment && drill.equipment.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Equipment Needed</h3>
            <div className="flex flex-wrap gap-2">
              {drill.equipment.map(eq => (
                <Badge key={eq} variant="secondary">{eq}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button className="flex-1">Start Drill</Button>
          {athleteId && <Button variant="outline">Save to Favorites</Button>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
