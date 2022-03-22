using PersonalAccount.Server.Parsers;
using PersonalAccount.Server.ViewModels;

namespace PersonalAccount.Server.Requests
{
    public static class RozkladRequests
    {
        public static readonly string BaseUrl = "https://rozklad.ztu.edu.ua";
        public static readonly string UrlGroup = BaseUrl + "/schedule/group/";

        private static HttpClient httpClient = new HttpClient();

        public static async Task<string> GetRandomGroupAsync()
        {
            HttpResponseMessage groupsResponse = await httpClient.GetAsync(BaseUrl);
            string groupsResponseText = await groupsResponse.Content.ReadAsStringAsync();
            return await RozkladParsers.GetRandomGroup(groupsResponseText);
        }
        
        public static async Task<List<Week>> GetScheduleForTwoWeekAsync(string group, int subGroup)
        {
            HttpResponseMessage scheduleResponse = await httpClient.GetAsync(UrlGroup + group);
            string scheduleResponseText = await scheduleResponse.Content.ReadAsStringAsync();
            return await RozkladParsers.GetScheduleForTwoWeekAsync(scheduleResponseText, subGroup);
        }
        
        public static async Task<List<Subject>> GetScheduleForToday(string group, int subGroup)
        {
            HttpResponseMessage scheduleResponse = await httpClient.GetAsync(UrlGroup + group);
            string scheduleResponseText = await scheduleResponse.Content.ReadAsStringAsync();
            return await RozkladParsers.GetScheduleForTodayAsync(scheduleResponseText, subGroup);
        }
    }
}

