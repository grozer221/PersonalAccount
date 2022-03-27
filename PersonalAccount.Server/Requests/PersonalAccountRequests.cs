﻿using PersonalAccount.Server.Parsers;
using PersonalAccount.Server.ViewModels;

namespace PersonalAccount.Server.Requests
{
    public static class PersonalAccountRequests
    {
        public static readonly string BaseUrl = "https://cabinet.ztu.edu.ua";
        public static readonly string ScheduleUrl = BaseUrl + "/site/schedule";
        public static readonly string LoginUrl = BaseUrl + "/site/login";
        public static readonly string SelectiveSubjectsUrl = BaseUrl + "/site/select";


        public static async Task<List<string>?> Login(string userName, string password)
        {
            HttpClient httpClient = new HttpClient();
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
                return loginPostResponse.Headers.GetValues("Set-Cookie").ToList();
        }

        public static async Task<List<Subject>> GetScheduleWithLinksForToday(List<string> cookie)
        {
            HttpClient httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Add("Cookie", string.Join(";", cookie));
            HttpResponseMessage scheduleResponse = await httpClient.GetAsync(ScheduleUrl);
            string scheduleResponseText = await scheduleResponse.Content.ReadAsStringAsync();
            List<Subject> schedule = await PersonalAccountParsers.GetScheduleWithLinksForToday(scheduleResponseText);
            return schedule.DistinctBy(s => new {s.Time, s.Cabinet, s.Teacher}).ToList();
        }
        
        public static async Task<List<Subject>> GetMyScheduleWithLinksForToday(List<string> cookie, string group, int subGroup, int englishSubGroup, List<SelectiveSubject> selectiveSubjects)
        {
            List<Subject> scheduleForToday = (await RozkladRequests.GetScheduleForToday(group, subGroup, englishSubGroup, selectiveSubjects)).ToList();
            List<Subject> scheduleWithLinksForToday = (await GetScheduleWithLinksForToday(cookie)).ToList();
            //List<Subject> finallScheduleWithLinksForToday = new List<Subject>();
            //foreach(var subjectForToday in scheduleForToday)
            //{
            //    foreach (var subjectWithLinkForToday in scheduleWithLinksForToday)
            //    {
            //        if (subjectForToday.Time != subjectWithLinkForToday.Time 
            //            || subjectForToday.Cabinet != subjectWithLinkForToday.Cabinet 
            //            || subjectForToday.Teacher != subjectWithLinkForToday.Teacher)
            //            continue;
            //        finallScheduleWithLinksForToday.Add(subjectWithLinkForToday);
            //    }
            //}
            //return finallScheduleWithLinksForToday;
            return scheduleWithLinksForToday
                .Where(s => scheduleForToday.Any(ss => ss.Time == s.Time && ss.Cabinet == s.Cabinet && ss.Teacher == s.Teacher))
                .ToList();
        }

        public static async Task<string> GetMyGroup(List<string> cookie)
        {
            HttpClient httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Add("Cookie", string.Join(";", cookie));
            HttpResponseMessage mainPageResponse = await httpClient.GetAsync(BaseUrl);
            string mainPageResponseText = await mainPageResponse.Content.ReadAsStringAsync();
            return await PersonalAccountParsers.GetMyGroup(mainPageResponseText);
        }

        public static async Task<List<SelectiveSubject>> GetSelectiveSubjects(List<string> cookie)
        {
            HttpClient httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Add("Cookie", string.Join(";", cookie));
            HttpResponseMessage selectiveSubjectsPageResponse = await httpClient.GetAsync(SelectiveSubjectsUrl);
            string selectiveSubjectsPageResponseText = await selectiveSubjectsPageResponse.Content.ReadAsStringAsync();
            return await PersonalAccountParsers.GetSelectiveSubjects(selectiveSubjectsPageResponseText);
        }
    }
}
