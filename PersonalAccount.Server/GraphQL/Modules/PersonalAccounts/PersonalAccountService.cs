using PersonalAccount.Server.ViewModels;

namespace PersonalAccount.Server.GraphQL.Modules.PersonalAccounts
{
    public class PersonalAccountService
    {
        public const string BaseUrl = "https://cabinet.ztu.edu.ua";
        public const string ScheduleUrl = BaseUrl + "/site/schedule";
        public const string LoginUrl = BaseUrl + "/site/login";
        public const string SelectiveSubjectsUrl = BaseUrl + "/site/select";
        public readonly PersonalAccountParsers _personalAccountParsers;
        public readonly ScheduleService _scheduleService;

        public PersonalAccountService(PersonalAccountParsers personalAccountParsers, ScheduleService scheduleService)
        {
            _personalAccountParsers = personalAccountParsers;
            _scheduleService = scheduleService;
        }

        public async Task<List<string>?> Login(string userName, string password)
        {
            HttpClient httpClient = new HttpClient();
            HttpResponseMessage loginGetResponse = await httpClient.GetAsync(LoginUrl);
            string loginGetResponseText = await loginGetResponse.Content.ReadAsStringAsync();
            string _csrf_frontend = await _personalAccountParsers.GetCsrfFrontend(loginGetResponseText);
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

        public async Task<List<Subject>> GetScheduleWithLinksForToday(List<string> cookie)
        {
            HttpClient httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Add("Cookie", string.Join(";", cookie));
            HttpResponseMessage scheduleResponse = await httpClient.GetAsync(ScheduleUrl);
            string scheduleResponseText = await scheduleResponse.Content.ReadAsStringAsync();
            List<Subject> schedule = await _personalAccountParsers.GetScheduleWithLinksForToday(scheduleResponseText);
            return schedule.DistinctBy(s => new {s.Time, s.Cabinet, s.Teacher}).ToList();
        }
        
        public async Task<List<Subject>> GetMyScheduleWithLinksForToday(List<string> cookie, string group, int subGroup, int englishSubGroup, List<SelectiveSubject> selectiveSubjects)
        {
            List<Subject> scheduleForToday = (await _scheduleService.GetScheduleForToday(group, subGroup, englishSubGroup, selectiveSubjects)).ToList();
            List<Subject> scheduleWithLinksForToday = (await GetScheduleWithLinksForToday(cookie)).ToList();
            return scheduleWithLinksForToday
                .Where(s => scheduleForToday.Any(ss => ss.Time == s.Time && ss.Cabinet == s.Cabinet && ss.Teacher == s.Teacher))
                .ToList();
        }

        public async Task<string> GetMyGroup(List<string> cookie)
        {
            HttpClient httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Add("Cookie", string.Join(";", cookie));
            HttpResponseMessage mainPageResponse = await httpClient.GetAsync(BaseUrl);
            string mainPageResponseText = await mainPageResponse.Content.ReadAsStringAsync();
            return await _personalAccountParsers.GetMyGroup(mainPageResponseText);
        }

        public async Task<List<SelectiveSubject>> GetSelectiveSubjects(List<string> cookie)
        {
            HttpClient httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Add("Cookie", string.Join(";", cookie));
            HttpResponseMessage selectiveSubjectsPageResponse = await httpClient.GetAsync(SelectiveSubjectsUrl);
            string selectiveSubjectsPageResponseText = await selectiveSubjectsPageResponse.Content.ReadAsStringAsync();
            return await _personalAccountParsers.GetSelectiveSubjects(selectiveSubjectsPageResponseText);
        }
    }
}
