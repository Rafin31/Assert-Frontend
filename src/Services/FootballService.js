import ServerApi from '../api/ServerAPI';
import dayjs from 'dayjs';

export const getFixturesForNext14Days = async () => {
    const today = dayjs().format('YYYY-MM-DD');
    const nextWeek = dayjs().add(14, 'day').format('YYYY-MM-DD');

    const res = await ServerApi.get(
        `/football/fixtures?date_from=${today}&date_to=${nextWeek}`
    );

    return res.data || [];
};
