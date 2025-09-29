import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

interface Segment {
  id: string;
  title: string;
  description: string;
  driveUrl: string;
  thumbnail: string;
}

const Students: React.FC = () => {
  const degreeSegments: Segment[] = [
    {
      id: 'deg-1',
      title: 'Architecture Design Studio',
      description: 'Foundational design projects and explorations',
      driveUrl: 'https://drive.google.com/drive/folders/example1',
      thumbnail: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=300&fit=crop'
    },
    {
      id: 'deg-2',
      title: 'Urban Planning Projects',
      description: 'City planning and development concepts',
      driveUrl: 'https://drive.google.com/drive/folders/example2',
      thumbnail: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=300&fit=crop'
    },
    {
      id: 'deg-3',
      title: 'Sustainable Design',
      description: 'Eco-friendly and green building designs',
      driveUrl: 'https://drive.google.com/drive/folders/example3',
      thumbnail: 'https://images.unsplash.com/photo-1558618047-3c8ad155a0d3?w=400&h=300&fit=crop'
    },
    {
      id: 'deg-4',
      title: 'Digital Design & BIM',
      description: 'Computer-aided design and modeling projects',
      driveUrl: 'https://drive.google.com/drive/folders/example4',
      thumbnail: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop'
    },
    {
      id: 'deg-5',
      title: 'Construction Technology',
      description: 'Building systems and construction methods',
      driveUrl: 'https://drive.google.com/drive/folders/example5',
      thumbnail: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop'
    },
    {
      id: 'deg-6',
      title: 'Interior Design',
      description: 'Space planning and interior architecture',
      driveUrl: 'https://drive.google.com/drive/folders/example6',
      thumbnail: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'
    },
    {
      id: 'deg-7',
      title: 'Final Year Thesis',
      description: 'Capstone projects and dissertation work',
      driveUrl: 'https://drive.google.com/drive/folders/example7',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'
    }
  ];

  const masterSegments: Segment[] = [
    {
      id: 'mas-1',
      title: 'Advanced Design Research',
      description: 'Cutting-edge architectural research and innovation',
      driveUrl: 'https://drive.google.com/drive/folders/master1',
      thumbnail: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=400&h=300&fit=crop'
    },
    {
      id: 'mas-2',
      title: 'Heritage Conservation',
      description: 'Preservation and restoration of historic buildings',
      driveUrl: 'https://drive.google.com/drive/folders/master2',
      thumbnail: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a0e?w=400&h=300&fit=crop'
    },
    {
      id: 'mas-3',
      title: 'Smart Cities & Technology',
      description: 'Integration of technology in urban environments',
      driveUrl: 'https://drive.google.com/drive/folders/master3',
      thumbnail: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop'
    },
    {
      id: 'mas-4',
      title: 'Master\'s Thesis Portfolio',
      description: 'Final research projects and professional portfolios',
      driveUrl: 'https://drive.google.com/drive/folders/master4',
      thumbnail: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=300&fit=crop'
    }
  ];

  const SegmentCard: React.FC<{ segment: Segment }> = ({ segment }) => (
    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105">
      <a 
        href={segment.driveUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block"
      >
        <div className="relative overflow-hidden rounded-t-lg">
          <img 
            src={segment.thumbnail} 
            alt={segment.title}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
          <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ExternalLink className="w-4 h-4 text-primary" />
          </div>
        </div>
        <CardHeader>
          <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">
            {segment.title}
          </CardTitle>
          <CardDescription className="text-sm">
            {segment.description}
          </CardDescription>
        </CardHeader>
      </a>
    </Card>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-light mb-4">Student Work</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore the outstanding projects and portfolios created by our architecture students across degree and master programs.
            </p>
          </div>

          {/* Degree Section */}
          <section className="mb-16">
            <div className="mb-8">
              <h2 className="text-3xl font-light mb-2">Bachelor's Degree Projects</h2>
              <p className="text-muted-foreground">
                Foundational work showcasing developing skills and creative exploration
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {degreeSegments.map((segment) => (
                <SegmentCard key={segment.id} segment={segment} />
              ))}
            </div>
          </section>

          {/* Master Section */}
          <section>
            <div className="mb-8">
              <h2 className="text-3xl font-light mb-2">Master's Program Projects</h2>
              <p className="text-muted-foreground">
                Advanced research and specialized architectural investigations
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {masterSegments.map((segment) => (
                <SegmentCard key={segment.id} segment={segment} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Students;