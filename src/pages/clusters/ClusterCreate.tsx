import React from 'react';
import ClusterCreateForm from '@/components/clusters/ClusterCreateForm';
import VideoBackground from '@/components/common/VideoBackground';

const ClusterCreate = () => {
  return (
    <>
      <VideoBackground />
      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <ClusterCreateForm />
        </div>
      </div>
    </>
  );
};

export default ClusterCreate;