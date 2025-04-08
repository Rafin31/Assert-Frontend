import { PollCard } from '../../components/PollPrediction/PollCard';
import React, { useEffect, useState } from "react";
import axios from "axios";
import ServerApi from '../../api/ServerAPI';


const PoliticsPage = () => {
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await ServerApi.get('/userPrediction/predictions');
        console.log(response)
    
        // Check if the response status is OK (200-299 range)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const data = await response.json();
    
        if (data.success) {
          setPredictions(data.data);
        } else {
          console.error('Error fetching predictions:', data.message);
        }
      } catch (error) {
        console.error('Error fetching predictions:', error.message);
      }
    };
    

    fetchPredictions();
  }, []); // Empty dependency array ensures it runs once when component mounts

  return (
    <div>
      <h1>Predictions</h1>
      <ul>
        {predictions.map((prediction, index) => (
          <li key={index}>
            <strong>{prediction.question}</strong> - {prediction.username} ({prediction.email})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PoliticsPage;
