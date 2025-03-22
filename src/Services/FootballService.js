import footballApi from '../api/footballAPI';
import dayjs from 'dayjs';

export const getUpcomingFixtures = async () => {
    const today = dayjs().format('YYYY-MM-DD');
    const nextWeek = dayjs().add(7, 'day').format('YYYY-MM-DD');

    //https://api.sportmonks.com/v3/football

    try {
        const res = await footballApi.get('/fixtures/between', {
            params: {
                'filter[date_from]': today,
                'filter[date_to]': nextWeek,
                include: 'participants,league',
            },
        });
        return res;
    } catch (error) {
        console.error('Error fetching fixtures:', error);
        return [];
    }
};
