import { PollCard } from '../../components/PollPrediction/PollCard';
import React, { useEffect, useState } from "react";
import ServerApi from '../../api/ServerAPI';

const PoliticsPage = () => {
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await ServerApi.get('/userPrediction/predictions', {
          params: {
            realm: 'politics',
            status: 'approved'
          }
        });
  
        if (response.data.success) {
          setPredictions(response.data.data);
        } else {
          console.error('Error fetching predictions:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching predictions:', error.message);
      }
    };
  
    fetchPredictions();
  }, []);
  

  return (
    <div className='bg-base-100 p-10 mx-auto flex flex-wrap justify-center gap-6'>
      {predictions.map((prediction, index) => (
        <PollCard key={index} data={prediction} />
      ))}
    </div>
  );
};

export default PoliticsPage;
