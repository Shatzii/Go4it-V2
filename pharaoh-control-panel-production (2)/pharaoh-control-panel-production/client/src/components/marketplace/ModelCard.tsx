import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Star } from 'lucide-react';

interface ModelCardProps {
  model: {
    id: string;
    name: string;
    description: string;
    icon: string;
    type: string;
    memory: string;
    verified: boolean;
    featured?: boolean;
    badge?: string;
    color: string;
    status: string;
    rating?: number;
    reviewCount?: number;
    price?: string;
    category?: string;
    publisherName?: string;
    publisherVerified?: boolean;
  };
  onSelect: (model: any) => void;
  isInstalling?: boolean;
  isInstalled?: boolean;
  isPremium?: boolean;
}

const ModelCard: React.FC<ModelCardProps> = ({
  model,
  onSelect,
  isInstalling,
  isInstalled,
  isPremium
}) => {
  // Get badge variant based on model color property
  const getBadgeVariant = (color: string) => {
    switch (color) {
      case 'primary':
        return 'default';
      case 'secondary':
        return 'secondary';
      case 'accent':
        return 'outline';
      default:
        return 'default';
    }
  };

  // Format rating (e.g., 4.5)
  const formatRating = (rating?: number) => {
    if (!rating) return '0.0';
    return rating.toFixed(1);
  };

  return (
    <Card 
      className={`bg-dark-900 border-dark-700 hover:border-dark-600 transition-colors overflow-hidden relative h-full ${
        model.featured ? 'border-primary-600 ring-1 ring-primary-600' : ''
      }`}
    >
      {/* Colored accent bar at top */}
      <div className={`h-1 w-full bg-${model.color}-600`} />
      
      {/* Badge in top corner if applicable */}
      {model.badge && (
        <Badge 
          className="absolute top-3 right-3 bg-primary-600 text-primary-100"
          variant={getBadgeVariant(model.color)}
        >
          {model.badge}
        </Badge>
      )}
      
      {/* Premium indicator */}
      {isPremium && (
        <Badge 
          className="absolute top-3 left-3 bg-amber-600 text-amber-100 border-amber-700"
        >
          Premium
        </Badge>
      )}
      
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 text-lg font-medium">
          <span className="material-icons text-primary-500 mr-1">
            {model.icon}
          </span>
          {model.name}
          {model.verified && (
            <span className="material-icons text-blue-400 text-sm">
              verified
            </span>
          )}
        </div>
        <div className="text-gray-400 text-sm">
          {model.type}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex justify-between items-center mb-3">
          {/* Rating stars */}
          {model.rating && (
            <div className="flex items-center">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-3.5 w-3.5 ${
                      star <= Math.round(model.rating || 0)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-gray-500'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-1 text-xs text-gray-400">
                {formatRating(model.rating)} {model.reviewCount && `(${model.reviewCount})`}
              </span>
            </div>
          )}
          
          {/* Memory usage */}
          <span className="flex items-center bg-dark-800 px-2 py-1 rounded text-xs text-gray-400">
            <span className="material-icons text-xs mr-1">memory</span>
            {model.memory}
          </span>
        </div>
        
        {/* Description */}
        <p className="text-gray-300 text-sm line-clamp-3 mb-2">
          {model.description}
        </p>
        
        {/* Publisher info if available */}
        {model.publisherName && (
          <div className="flex items-center text-xs text-gray-400 mt-3">
            <span>By </span>
            <span className="font-medium text-gray-300 ml-1">
              {model.publisherName}
            </span>
            {model.publisherVerified && (
              <span className="material-icons text-blue-400 text-xs ml-0.5">
                verified
              </span>
            )}
          </div>
        )}
        
        {/* Category tag */}
        {model.category && (
          <div className="mt-2">
            <Badge variant="outline" className="text-xs bg-dark-800">
              {model.category}
            </Badge>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0">
        <div className="flex gap-2 w-full">
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1 border-dark-700"
            onClick={() => onSelect(model)}
          >
            Details
          </Button>
          
          {isInstalled ? (
            <Button 
              disabled
              className="flex-1"
              size="sm"
            >
              Installed
            </Button>
          ) : isInstalling ? (
            <Button 
              disabled
              className="flex-1"
              size="sm"
            >
              <Spinner size="xs" className="mr-1" />
              Installing...
            </Button>
          ) : (
            <Button 
              className="flex-1"
              size="sm"
              onClick={() => onSelect(model)}
            >
              Install
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ModelCard;