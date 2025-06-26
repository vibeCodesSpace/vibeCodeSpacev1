import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Settings, Trash2, Eye } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  type: 'resume' | 'prompt';
  url: string;
  status: 'building' | 'deployed' | 'error';
  createdAt: string;
  description?: string;
}

interface ProjectListProps {
  projects: Project[];
}

const ProjectList = ({ projects }: ProjectListProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed': return 'bg-green-500';
      case 'building': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'deployed': return 'Live';
      case 'building': return 'Building';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  };
