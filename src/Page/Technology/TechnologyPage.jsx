import { useEffect, useState } from 'react';
import ServerApi from '../../api/ServerAPI';
import OutcomePoll from '../../components/PollPrediction/OutcomePoll';

const TechnologyPage = () => {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await ServerApi.get('/userPoll/poll', {
          params: {
            realm: 'technology',
            status: 'approved'
          }
        });

        if (response.data.success) {
          setPolls(response.data.data);
        } else {
          console.error('Error fetching polls:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching polls:', error.message);
      }
    };

    fetchPolls();
  }, []);

  return (
    <div className="py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Technology Polls</h1>
      <OutcomePoll data={polls} />
    </div>
  );
};

export default TechnologyPage;
