import React, { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AthletesList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sportFilter, setSportFilter] = useState('all');
  const [gradeFilter, setGradeFilter] = useState('all');

  // Fetch athletes
  const { data: athletes = [], isLoading } = useQuery({
    queryKey: ['/api/athletes'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/athletes');
        if (!response.ok) {
          throw new Error('Failed to fetch athletes');
        }
        return response.json();
      } catch (err) {
        console.error("Error fetching athletes:", err);
        return [];
      }
    }
  });

  // Get unique sports and grades for filters
  const sports = ['all', ...new Set(athletes.map((a: any) => a.sport).filter(Boolean))];
  const grades = ['all', ...new Set(athletes.map((a: any) => a.gradeLevel).filter(Boolean))];

  // Filter athletes
  const filteredAthletes = athletes.filter((athlete: any) => {
    // Search filter
    const matchesSearch = !searchTerm || 
      athlete.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      athlete.school?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Sport filter
    const matchesSport = sportFilter === 'all' || athlete.sport === sportFilter;
    
    // Grade filter
    const matchesGrade = gradeFilter === 'all' || athlete.gradeLevel?.toString() === gradeFilter;
    
    return matchesSearch && matchesSport && matchesGrade;
  });

  return (
    <div className="container max-w-screen-xl mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-2">Athletes Directory</h1>
      <p className="text-muted-foreground mb-6">Browse and discover athletes in our network</p>

      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search athletes by name or school..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <div className="w-40">
            <Select value={sportFilter} onValueChange={setSportFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Sport" />
              </SelectTrigger>
              <SelectContent>
                {sports.map((sport) => (
                  <SelectItem key={sport} value={sport}>
                    {sport === 'all' ? 'All Sports' : sport}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-40">
            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Grade" />
              </SelectTrigger>
              <SelectContent>
                {grades.map((grade) => (
                  <SelectItem key={grade} value={grade}>
                    {grade === 'all' ? 'All Grades' : `Grade ${grade}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Showing {filteredAthletes.length} athletes
          {searchTerm && ` matching "${searchTerm}"`}
          {sportFilter !== 'all' && ` in ${sportFilter}`}
          {gradeFilter !== 'all' && ` in grade ${gradeFilter}`}
        </p>
      </div>

      {/* Athletes grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="animate-pulse rounded-lg p-4 border">
              <div className="flex items-center gap-4 mb-4">
                <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredAthletes.length === 0 ? (
        <div className="text-center py-12 border rounded-md">
          <h3 className="text-xl font-semibold mb-2">No Athletes Found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search criteria or filters.
          </p>
          <Button onClick={() => {
            setSearchTerm('');
            setSportFilter('all');
            setGradeFilter('all');
          }}>
            Clear All Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAthletes.map((athlete: any) => (
            <Link key={athlete.id} href={`/athletes/${athlete.id}`}>
              <a>
                <Card className="overflow-hidden h-full transition-all hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar>
                        <AvatarImage src={athlete.profileImage} alt={athlete.name} />
                        <AvatarFallback>{athlete.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{athlete.name}</h3>
                        <p className="text-sm text-muted-foreground">{athlete.school}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {athlete.sport && (
                        <Badge variant="secondary">{athlete.sport}</Badge>
                      )}
                      {athlete.position && (
                        <Badge variant="outline">{athlete.position}</Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-3 text-center text-sm">
                      <div>
                        <p className="font-semibold">{athlete.height || "--"}</p>
                        <p className="text-xs text-muted-foreground">Height</p>
                      </div>
                      <div>
                        <p className="font-semibold">{athlete.weight || "--"}</p>
                        <p className="text-xs text-muted-foreground">Weight</p>
                      </div>
                      <div>
                        <p className="font-semibold">{athlete.garScore || "--"}</p>
                        <p className="text-xs text-muted-foreground">GAR</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </a>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}