import ServerApi from '../api/ServerAPI';


// const today = dayjs().format('YYYY-MM-DD');
// const nextWeek = dayjs().subtract(7, 'day').format('YYYY-MM-DD');

export const getFixturesForDateRange = async (from, to) => {
    const res = await ServerApi.get(`/football/fixtures?date_from=${from}&date_to=${to}`);
    return res.data || [];
};
