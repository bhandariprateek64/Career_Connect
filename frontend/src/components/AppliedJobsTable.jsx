import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Badge } from './ui/badge';
import { useSelector } from 'react-redux';

const AppliedJobTable = () => {
  // Ensure `allAppliedJobs` defaults to an empty array to avoid undefined errors
  const { allAppliedJobs = [] } = useSelector((store) => store.job);

  // Check if there are no applied jobs
  if (allAppliedJobs.length === 0) {
    return <div>You haven't applied for any jobs yet.</div>;
  }

  return (
    <div>
      <Table>
        <TableCaption>A list of your applied jobs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Job Role</TableHead>
            <TableHead>Company</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allAppliedJobs.map((appliedJob) => (
            <TableRow key={appliedJob._id}>
              <TableCell>{appliedJob?.createdAt?.split('T')[0]}</TableCell>
              <TableCell>{appliedJob.job?.title}</TableCell>
              <TableCell>{appliedJob.job?.company?.name}</TableCell>
              <TableCell className="text-right">
                <Badge
                  className={`${
                    appliedJob?.status === 'rejected'
                      ? 'bg-red-400'
                      : appliedJob.status === 'pending'
                      ? 'bg-gray-400'
                      : 'bg-green-400'
                  }`}
                >
                  {appliedJob.status.toUpperCase()}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppliedJobTable;
