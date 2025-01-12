import React from 'react';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();
  return (
    <div
      className="p-5 rounded-md shadow-xl bg-white border border-gray-100 cursor-pointer"
      onClick={() => navigate(`/job/description/${job._id}`)}
    >
      <div className="flex items-center gap-4">
        {job?.company?.logo && (
          <img
            src={job?.company?.logo}
            alt={`${job?.company?.name} Logo`}
            className="w-12 h-12 object-contain"
          />
        )}
        <div>
          <h1 className="font-medium text-lg">{job?.company?.name}</h1>
          <p className="text-sm text-gray-500">India</p>
        </div>
      </div>
      <div>
        <h1 className="text-lg font-bold my-2">{job?.title}</h1>
        <p className="text-sm text-gray-600">{job?.description}</p>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <Badge className="text-blue-700 font-bold" variant="ghost">
          {job?.position} Positions
        </Badge>
        <Badge className="text-[#F83002] font-bold" variant="ghost">
          {job?.jobType}
        </Badge>
        <Badge className="text-[#7209B7] font-bold" variant="ghost">
          {job?.salary} LPA
        </Badge>
      </div>
    </div>
  );
};

export default LatestJobCards;
