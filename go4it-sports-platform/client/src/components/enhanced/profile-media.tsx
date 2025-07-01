import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Camera, 
  Video, 
  Upload, 
  Play, 
  Edit, 
  Trash2, 
  Star,
  CheckCircle,
  Calendar,
  Eye
} from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import StarRating from "./star-rating";

interface ProfileMediaProps {
  user: any;
  garScores: any[];
}

export default function ProfileMedia({ user, garScores }: ProfileMediaProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<'photo' | 'highlight'>('photo');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const latestGarScore = garScores[0]?.overallScore || 0;

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const endpoint = mediaType === 'photo' ? '/api/profile/photo' : '/api/highlights/upload';
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Upload Successful",
        description: `${mediaType === 'photo' ? 'Profile photo' : 'Highlight tape'} uploaded successfully`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      setSelectedFile(null);
      setTitle('');
      setDescription('');
    },
    onError: () => {
      toast({
        title: "Upload Failed",
        description: "Please try again later",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append(mediaType === 'photo' ? 'photo' : 'video', selectedFile);
    if (title) formData.append('title', title);
    if (description) formData.append('description', description);

    uploadMutation.mutate(formData);
  };

  const mockHighlights = [
    {
      id: 1,
      title: "Championship Winning Shot",
      sport: "Basketball",
      garScore: 94,
      views: 1247,
      uploadDate: "2024-06-01",
      thumbnail: "/api/placeholder/320/180"
    },
    {
      id: 2,
      title: "Perfect Free Throw Streak",
      sport: "Basketball", 
      garScore: 96,
      views: 892,
      uploadDate: "2024-05-15",
      thumbnail: "/api/placeholder/320/180"
    },
    {
      id: 3,
      title: "Defensive Highlights",
      sport: "Basketball",
      garScore: 88,
      views: 634,
      uploadDate: "2024-05-01",
      thumbnail: "/api/placeholder/320/180"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Profile Photo Section */}
      <Card className="bg-slate-800/50 border-cyan-400/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-cyan-400" />
            Profile Photo & Verification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-slate-900 text-3xl font-bold overflow-hidden">
                  {user?.profilePhoto ? (
                    <img 
                      src={user.profilePhoto} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user?.firstName?.[0] || user?.username?.[0] || 'A'
                  )}
                </div>
                <div className="absolute -top-2 -right-2">
                  <StarRating garScore={latestGarScore} size="sm" showScore={false} />
                </div>
                <div className="absolute -bottom-2 -right-2">
                  <div className="verified-badge text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {user?.firstName} {user?.lastName || user?.username}
                </h3>
                <div className="flex items-center gap-4 mb-3">
                  <StarRating garScore={latestGarScore} size="md" />
                  <Badge className="verified-badge">
                    GAR {latestGarScore} Athlete
                  </Badge>
                </div>
                <p className="text-slate-400">
                  {user?.sport || 'Multi-Sport'} • {user?.position || 'Athlete'} • Class of {user?.graduationYear || '2025'}
                </p>
              </div>

              <div className="space-y-3">
                <Label>Upload New Profile Photo</Label>
                <div className="flex gap-3">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      setMediaType('photo');
                      handleFileSelect(e);
                    }}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleUpload}
                    disabled={!selectedFile || uploadMutation.isPending}
                    className="neon-glow"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Update
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Highlight Tapes Section */}
      <Card className="bg-slate-800/50 border-cyan-400/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="w-5 h-5 text-cyan-400" />
            Highlight Tapes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Upload New Highlight */}
          <div className="bg-slate-900/50 rounded-lg p-6 mb-6 border border-cyan-400/20">
            <h4 className="text-lg font-semibold text-white mb-4">Upload New Highlight</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Championship winning shot..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Video File</Label>
                <Input
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    setMediaType('highlight');
                    handleFileSelect(e);
                  }}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="mb-4">
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe this highlight..."
                className="mt-1"
                rows={3}
              />
            </div>
            <Button 
              onClick={handleUpload}
              disabled={!selectedFile || !title || uploadMutation.isPending}
              className="neon-glow"
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploadMutation.isPending ? 'Uploading...' : 'Upload Highlight'}
            </Button>
          </div>

          {/* Existing Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockHighlights.map((highlight) => (
              <Card key={highlight.id} className="bg-slate-900/50 border-slate-700 achievement-glow">
                <CardContent className="p-0">
                  <div className="relative">
                    <div className="aspect-video bg-slate-800 rounded-t-lg flex items-center justify-center">
                      <Play className="w-12 h-12 text-cyan-400 neon-glow" />
                    </div>
                    <div className="absolute top-2 right-2">
                      <StarRating garScore={highlight.garScore} size="sm" />
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="secondary" className="text-xs">
                        <Eye className="w-3 h-3 mr-1" />
                        {highlight.views}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h5 className="font-semibold text-white mb-2">{highlight.title}</h5>
                    <div className="flex items-center justify-between text-sm text-slate-400 mb-3">
                      <span>{highlight.sport}</span>
                      <span>{new Date(highlight.uploadDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-400 border-red-400 hover:bg-red-400/10">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {mockHighlights.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h4 className="text-lg font-medium text-white mb-2">No highlight tapes yet</h4>
              <p>Upload your first highlight to showcase your skills</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}