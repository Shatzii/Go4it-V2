import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Award, Calendar, Eye, ThumbsUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Helper function to get score color
const getScoreColor = (score: number): string => {
  if (score >= 8.5) return 'bg-emerald-500 text-white';
  if (score >= 7) return 'bg-green-500 text-white';
  if (score >= 5.5) return 'bg-amber-500 text-white';
  if (score >= 4) return 'bg-orange-500 text-white';
  return 'bg-red-500 text-white';
};

interface VideoHighlightsListProps {
  highlights: any[];
  onSelectHighlight: (highlight: any) => void;
  selectedHighlightId?: number;
}

const VideoHighlightsList: React.FC<VideoHighlightsListProps> = ({ 
  highlights, 
  onSelectHighlight,
  selectedHighlightId
}) => {
  if (!highlights || highlights.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-muted/10">
        <p className="text-muted-foreground">No highlights available</p>
      </div>
    );
  }
  
  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-3">
        {highlights.map((highlight) => (
          <Card 
            key={highlight.id}
            className={`overflow-hidden cursor-pointer transition-all hover:border-primary ${
              selectedHighlightId === highlight.id ? 'border-primary ring-1 ring-primary' : ''
            }`}
            onClick={() => onSelectHighlight(highlight)}
          >
            <div className="relative">
              {highlight.thumbnailPath && (
                <img 
                  src={highlight.thumbnailPath} 
                  alt={highlight.title}
                  className="w-full h-32 object-cover"
                />
              )}
              {!highlight.thumbnailPath && (
                <div className="w-full h-32 bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">No thumbnail</span>
                </div>
              )}
              
              {/* Display GAR score in top-right corner */}
              {highlight.garScore && (
                <div className={`absolute top-2 right-2 px-2 py-1 rounded-md ${getScoreColor(highlight.garScore)} flex items-center text-sm font-medium`}>
                  <Award className="w-3 h-3 mr-1" />
                  {typeof highlight.garScore === 'number' ? highlight.garScore.toFixed(1) : '?'}
                </div>
              )}
            </div>
            
            <CardContent className="p-3">
              <h3 className="font-medium text-sm line-clamp-1">
                {highlight.title}
              </h3>
              
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>
                    {highlight.createdAt ? 
                      formatDistanceToNow(new Date(highlight.createdAt), { addSuffix: true }) : 
                      'recently'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {highlight.views > 0 && (
                    <div className="flex items-center">
                      <Eye className="w-3 h-3 mr-1" />
                      <span>{highlight.views}</span>
                    </div>
                  )}
                  
                  {highlight.likes > 0 && (
                    <div className="flex items-center">
                      <ThumbsUp className="w-3 h-3 mr-1" />
                      <span>{highlight.likes}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-2">
                {highlight.sportType && (
                  <Badge variant="outline" className="text-xs bg-primary/10">
                    {highlight.sportType}
                  </Badge>
                )}
                
                {highlight.status && (
                  <Badge variant={highlight.status === 'ready' ? 'default' : 'secondary'} className="text-xs">
                    {highlight.status}
                  </Badge>
                )}
                
                {highlight.aiGenerated && (
                  <Badge variant="secondary" className="text-xs bg-secondary/10">
                    AI Generated
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default VideoHighlightsList;