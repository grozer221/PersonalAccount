using PersonalAccount.Server.Parsers;
using PersonalAccount.Server.ViewModels;

namespace PersonalAccount.Server.Requests
{
    public static class RozkladRequests
    {
        public static readonly string BaseUrl = "https://rozklad.ztu.edu.ua";
        public static readonly string UrlGroup = BaseUrl + "/schedule/group/";


        public static async Task<string> GetRandomGroupAsync()
        {
            HttpClient httpClient = new HttpClient();
            HttpResponseMessage groupsResponse = await httpClient.GetAsync(BaseUrl);
            string groupsResponseText = await groupsResponse.Content.ReadAsStringAsync();
            return await RozkladParsers.GetRandomGroup(groupsResponseText);
        }
        
        public static async Task<List<Week>> GetScheduleForTwoWeekAsync(string group, int subGroup)
        {
            HttpClient httpClient = new HttpClient();
            HttpResponseMessage scheduleResponse = await httpClient.GetAsync(UrlGroup + group);
            string scheduleResponseText = await scheduleResponse.Content.ReadAsStringAsync();
            return await RozkladParsers.GetScheduleForTwoWeekAsync(scheduleResponseText, subGroup);
        }
        
        public static async Task<List<Subject>> GetScheduleForToday(string group, int subGroup)
        {
            HttpClient httpClient = new HttpClient();
            HttpResponseMessage scheduleResponse = await httpClient.GetAsync(UrlGroup + group);
            string scheduleResponseText = await scheduleResponse.Content.ReadAsStringAsync();
            return await RozkladParsers.GetScheduleForTodayAsync(scheduleResponseText, subGroup);
        }
        
        public static async Task<List<string>> GetAllGroups()
        {
            HttpClient httpClient = new HttpClient();
            HttpResponseMessage mainPageResponse = await httpClient.GetAsync(BaseUrl);
            string mainPageResponseText = await mainPageResponse.Content.ReadAsStringAsync();
            return await RozkladParsers.GetAllGroup(mainPageResponseText);
        }
    }
}

