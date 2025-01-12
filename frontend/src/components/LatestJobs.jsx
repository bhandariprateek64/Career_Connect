import React from 'react';
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const LatestJobs = () => {
  const { allJobs = [] } = useSelector((store) => store.job); // Ensure allJobs is always an array
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto my-20">
      <h1 className="text-4xl font-bold">
        <span className="text-[#6A38C2]">Latest & Top </span>Job Openings
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
        {allJobs.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            No jobs available at the moment. Please check back later.
          </div>
        ) : (
          allJobs
            .slice(0, 6)
            .map((job) =>
              job?._id ? <LatestJobCards key={job._id} job={job} /> : null
            )
        )}
      </div>
    </div>
  );
};

export default LatestJobs;
