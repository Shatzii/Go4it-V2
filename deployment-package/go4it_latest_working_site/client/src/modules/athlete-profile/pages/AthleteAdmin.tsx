import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, 
  Pencil, 
  Trash2, 
  EyeIcon, 
  FileBarChart 
} from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { Link } from "wouter";

export default function AthleteAdmin() {
  // Fetch athletes data
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

  return (
    <div className="container max-w-screen-2xl mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Athlete Management</h1>
          <p className="text-muted-foreground">
            Manage athlete profiles and statistics
          </p>
        </div>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Athlete
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Athletes</CardTitle>
          <CardDescription>
            View and manage all athletes in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading athletes...</div>
          ) : athletes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No athletes found</p>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Your First Athlete
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Sport</TableHead>
                  <TableHead>School</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>GAR Score</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {athletes.map((athlete: any) => (
                  <TableRow key={athlete.id}>
                    <TableCell className="font-medium">{athlete.name}</TableCell>
                    <TableCell>{athlete.sport}</TableCell>
                    <TableCell>{athlete.school}</TableCell>
                    <TableCell>{athlete.gradeLevel}</TableCell>
                    <TableCell>{athlete.garScore || 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/athletes/${athlete.id}`}>
                            <EyeIcon className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/admin/athletes/${athlete.id}/stats`}>
                            <FileBarChart className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}