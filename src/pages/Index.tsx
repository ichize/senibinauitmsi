import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <div className="inline-block px-3 py-1 mb-2 text-xs font-medium uppercase tracking-wider text-primary bg-primary/5 rounded-full">
              Overview
            </div>
            <h1 className="text-3xl md:text-4xl font-light mb-4">Welcome to the Architecture Department</h1>
            <p className="text-lg text-muted-foreground">
              Explore the interactive 3D floor plans to discover studios, classrooms, and lecturer offices.
              Click on a floor to get started.
            </p>
          </div>

          {/* Restore 3D Overview section */}
          <div className="mb-12">
            <h2 className="text-2xl font-medium mb-3">Overview 3D</h2>
            <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center space-y-2">
              <img
                src="/og-image.png"
                alt="3D Overview"
                className="w-full max-w-lg rounded-md mb-2"
              />
              <span className="text-gray-500 text-xs text-center">
                Bird's-eye 3D perspective of the Architecture Department
              </span>
            </div>
          </div>
          {/* End 3D Overview section */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow animate-slide-in-from-left">
              <h3 className="text-lg font-medium mb-2">Ground Floor</h3>
              <p className="text-sm text-gray-600 mb-4">
                Studios, Archi Lab, and public spaces.
              </p>
              <Link to="/ground-floor" className="inline-flex items-center text-primary hover:underline">
                Explore Ground Floor
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="bg-white rounded-lg p-6 shadow animate-slide-in-from-left">
              <h3 className="text-lg font-medium mb-2">First Floor</h3>
              <p className="text-sm text-gray-600 mb-4">
                Studios, Crit Rooms, and lecturer offices.
              </p>
              <Link to="/first-floor" className="inline-flex items-center text-primary hover:underline">
                Explore First Floor
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="bg-white rounded-lg p-6 shadow animate-slide-in-from-right">
              <h3 className="text-lg font-medium mb-2">Second Floor</h3>
              <p className="text-sm text-gray-600 mb-4">
                Studios, and lecturer offices.
              </p>
              <Link to="/second-floor" className="inline-flex items-center text-primary hover:underline">
                Explore Second Floor
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="bg-white rounded-lg p-6 shadow animate-slide-in-from-right">
              <h3 className="text-lg font-medium mb-2">Third Floor</h3>
              <p className="text-sm text-gray-600 mb-4">
                Studios, and classrooms.
              </p>
              <Link to="/third-floor" className="inline-flex items-center text-primary hover:underline">
                Explore Third Floor
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="bg-white rounded-lg p-6 shadow animate-slide-in-from-left">
              <h3 className="text-lg font-medium mb-2">Fourth Floor</h3>
              <p className="text-sm text-gray-600 mb-4">
                Auditorium and Meeting Rooms.
              </p>
              <Link to="/fourth-floor" className="inline-flex items-center text-primary hover:underline">
                Explore Fourth Floor
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg p-6 shadow animate-slide-in-from-left">
              <h3 className="text-lg font-medium mb-2">About the Department</h3>
              <p className="text-sm text-gray-600">
                The Department of Architecture offers a comprehensive program designed to equip students with the skills and knowledge necessary to excel in the field of architecture.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow animate-slide-in-from-right">
              <h3 className="text-lg font-medium mb-2">Contact Information</h3>
              <p className="text-sm text-gray-600">
                For inquiries, please contact the department at <a href="mailto:architecture@example.com" className="text-primary hover:underline">architecture@example.com</a>.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 my-8">
        {/* "The Lecturers" button updated */}
        <Button asChild variant="secondary" size="lg">
          <Link to="/lecturers">
            The Lecturers
          </Link>
        </Button>
      </div>
    </Layout>
  );
};

export default Index;
