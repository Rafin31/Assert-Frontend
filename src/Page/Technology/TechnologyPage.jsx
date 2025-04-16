import { useEffect, useState } from 'react';
import ServerApi from '../../api/ServerAPI';
import OutcomePoll from '../../components/PollPrediction/OutcomePoll';
import Skeleton from '../../utils/skeleton';

const TechnologyPage = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true)

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
      setLoading(false)
    };

    fetchPolls();
  }, []);

  if (loading) {
    return (
      <div className="max-w-[1450px] mx-auto min-h-[80vh]">
        <Skeleton />
      </div>
    )
  }

  return (
    <div className="py-10 px-4">
      <OutcomePoll data={polls} />
    </div>
  );
};

export default TechnologyPage;
