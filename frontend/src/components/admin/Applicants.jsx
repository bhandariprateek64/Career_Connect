import React, { useEffect } from 'react';
import Navbar from '../shared/Navbar';
import ApplicantsTable from './ApplicantsTable';
import axios from 'axios';
import { APPLICATION_API_ENDPOINT } from '../../utils/constants';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '../../redux/applicationSlice';

const Applicants = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { applicants } = useSelector((store) => store.application);

  useEffect(() => {
    const fetchAllApplicants = async () => {

      try {
        const res = await axios.get(
          `${APPLICATION_API_ENDPOINT}/${params.id}/applicants`,
          { withCredentials: true }
        );


        if (res.data.success && res.data.applications) {
          dispatch(setAllApplicants(res.data.applications));
        } else {
          console.error('Unexpected API response structure:', res.data);
        }
      } catch (error) {
        console.error('Error fetching applicants:', error); // Error debugging
      }
    };

    fetchAllApplicants();
  }, [params.id, dispatch]);

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto">
        <h1 className="font-bold text-xl my-5">
          Applicants {applicants?.length || 0}
        </h1>
        <ApplicantsTable />
      </div>
    </div>
  );
};

export default Applicants;
