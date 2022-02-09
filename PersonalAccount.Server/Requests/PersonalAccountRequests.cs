using PersonalAccount.Server.Parsers;
using PersonalAccount.Server.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace PersonalAccount.Server.Requests
{
    public static class PersonalAccountRequests
    {
        public static readonly string BaseUrl = "https://cabinet.ztu.edu.ua/";
        public static readonly string ScheduleUrl = BaseUrl + "/site/schedule";
        public static readonly string LoginUrl = BaseUrl + "/site/login";

        private static HttpClient httpClient = new HttpClient();

        public static async Task<IEnumerable<string>> Login(string userName, string password)
        {
            HttpResponseMessage loginGetResponse = await httpClient.GetAsync(LoginUrl);
            string loginGetResponseText = await loginGetResponse.Content.ReadAsStringAsync();
            string _csrf_frontend = await PersonalAccountParsers.GetCsrfFrontend(loginGetResponseText);
            var content = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("_csrf-frontend", _csrf_frontend ),
                new KeyValuePair<string, string>("LoginForm[username]", userName),
                new KeyValuePair<string, string>("LoginForm[password]", password),
                new KeyValuePair<string, string>("LoginForm[rememberMe]", "1")
            });
            HttpResponseMessage loginPostResponse = await httpClient.PostAsync(LoginUrl, content);
            string loginPostResponseText = await loginPostResponse.Content.ReadAsStringAsync();
            if (loginPostResponseText.Contains("Неправильний логін або пароль"))
                return null;
            else
                return loginPostResponse.Headers.GetValues("Set-Cookie"); ;
        }

        public static async Task<IEnumerable<Subject>> GetScheduleWithLinksForToday(IEnumerable<string> cookie, string group, int subGroup)
        {
            httpClient.DefaultRequestHeaders.Add("Cookie", string.Join(";", cookie));
            HttpResponseMessage scheduleResponse = await httpClient.GetAsync(ScheduleUrl);
            string scheduleResponseText = await scheduleResponse.Content.ReadAsStringAsync();
            return await PersonalAccountParsers.GetScheduleWithLinksForToday(scheduleResponseText);
        }
        
        public static async Task<IEnumerable<Subject>> GetMyScheduleWithLinksForToday(IEnumerable<string> cookie, string group, int subGroup)
        {
            List<Subject> scheduleForToday = (await RozkladRequests.GetScheduleForToday(group, subGroup)).ToList();
            List<Subject> scheduleWithLinksForToday = (await GetScheduleWithLinksForToday(cookie, group, subGroup)).ToList();
            List<Subject> finallScheduleWithLinksForToday = new List<Subject>();
            foreach(var subjectForToday in scheduleForToday)
            {
                foreach (var subjectWithLinkForToday in scheduleWithLinksForToday)
                {
                    if (subjectForToday.Time != subjectWithLinkForToday.Time 
                        || subjectForToday.Cabinet != subjectWithLinkForToday.Cabinet 
                        || subjectForToday.Teacher != subjectWithLinkForToday.Teacher)
                        continue;
                    finallScheduleWithLinksForToday.Add(subjectWithLinkForToday);
                }
            }
            return finallScheduleWithLinksForToday;
        }
    }
}
