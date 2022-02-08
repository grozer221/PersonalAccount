using PersonalAccount.Server.Parsers;
using PersonalAccount.Server.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

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
        
        public static async Task<IEnumerable<Week>> GetScheduleForTwoWeekAsync(string group, int subGroup)
        {
            HttpResponseMessage scheduleResponse = await httpClient.GetAsync(UrlGroup + group);
            string scheduleResponseText = await scheduleResponse.Content.ReadAsStringAsync();
            return await RozkladParsers.GetScheduleForTwoWeekAsync(scheduleResponseText, subGroup);
        }
    }
}
