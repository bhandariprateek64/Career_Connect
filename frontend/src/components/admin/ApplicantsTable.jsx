import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_ENDPOINT } from '../../utils/constants';
import axios from 'axios';

const shortlistingStatus = ['Accepted', 'Rejected'];

const ApplicantsTable = () => {
  const { applicants } = useSelector((store) => store.application);

  const statusHandler = async (status, id) => {

    try {
      axios.defaults.withCredentials = true;
      const res = await axios.patch(
        `${APPLICATION_API_ENDPOINT}/status/${id}/update`,
        { status }
      );

      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error('Failed to update status.');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <div>
      <Table>
        <TableCaption>A list of your recent applied users</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Resume</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicants?.map((item) => (
            <TableRow key={item._id}>
              <TableCell>{item?.applicant?.fullName || 'NA'}</TableCell>
              <TableCell>{item?.applicant?.email || 'NA'}</TableCell>
              <TableCell>{item?.applicant?.phoneNumber || 'NA'}</TableCell>
              <TableCell>
                {item?.applicant?.profile?.resume ? (
                  <a
                    className="text-blue-600 cursor-pointer"
                    href={item.applicant.profile.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.applicant.profile.resumeOriginalName || 'View Resume'}
                  </a>
                ) : (
                  <span>NA</span>
                )}
              </TableCell>
              <TableCell>
                {item?.createdAt ? item.createdAt.split('T')[0] : 'NA'}
              </TableCell>
              <TableCell className="float-right cursor-pointer">
                <Popover>
                  <PopoverTrigger>
                    <MoreHorizontal />
                  </PopoverTrigger>
                  <PopoverContent className="w-32">
                    {shortlistingStatus.map((status, index) => (
                      <div
                        onClick={() => statusHandler(status, item._id)}
                        key={index}
                        className="flex w-fit items-center my-2 cursor-pointer"
                      >
                        <span>{status}</span>
                      </div>
                    ))}
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicantsTable;
