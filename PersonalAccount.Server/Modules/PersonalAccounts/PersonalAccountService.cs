
namespace PersonalAccount.Server.Modules.PersonalAccounts;

public class PersonalAccountService: IHostedService
{
    public const string BaseUrl = "https://cabinet.ztu.edu.ua";
    public const string ScheduleUrl = BaseUrl + "/site/schedule";
    public const string LoginUrl = BaseUrl + "/site/login";
    public const string SelectiveSubjectsUrl = BaseUrl + "/site/select";
    private Timer _reLoginInPesonalAccountsTimer;
    private readonly PersonalAccountParsers _personalAccountParsers;
    private readonly NotificationsService _notificationsService;
    private readonly IServiceProvider _services;

    public PersonalAccountService(PersonalAccountParsers personalAccountParsers, NotificationsService notificationsService, IServiceProvider services)
    {
        _personalAccountParsers = personalAccountParsers;
        _notificationsService = notificationsService;
        _services = services;
    }

    public Task StartAsync(CancellationToken cancellationToken)
    {
        _reLoginInPesonalAccountsTimer = new Timer(
            new TimerCallback(ReLoginInPesonalAccounts),
            null,
            TimeSpan.Zero,
            TimeSpan.FromDays(20));

        return Task.CompletedTask;
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        _reLoginInPesonalAccountsTimer?.Change(Timeout.Infinite, 0);
        return Task.CompletedTask;
    }

    private async void ReLoginInPesonalAccounts(object _)
    {
        using var scope = _services.CreateScope();
        UserRepository userRepository = scope.ServiceProvider.GetRequiredService<UserRepository>();
        List<UserModel> users = userRepository.Get();
        foreach (var user in users)
        {
            if(user.Settings.PersonalAccount != null)
            {
                string username = user.Settings.PersonalAccount.Username;
                string password = user.Settings.PersonalAccount.Password.Encrypt(Environment.GetEnvironmentVariable("CRYPT_KEY"));
                List<string>? cookie = await LoginAsync(username, password);
                if (cookie != null)
                    user.Settings.PersonalAccount.CookieList = cookie;
                else
                    user.Settings.PersonalAccount = null;
                await userRepository.UpdateAsync(user);
            }
        }
        _notificationsService.RebuildSchedule(new object());
        Console.WriteLine($"[{DateTime.Now}] ReLogin in personal accounts");
    }

    public async Task<List<string>?> LoginAsync(string username, string password)
    {
        HttpClient httpClient = new HttpClient();
        HttpResponseMessage loginGetResponse = await httpClient.GetAsync(LoginUrl);
        string loginGetResponseText = await loginGetResponse.Content.ReadAsStringAsync();
        string _csrf_frontend = await _personalAccountParsers.GetCsrfFrontend(loginGetResponseText);
        var content = new FormUrlEncodedContent(new[]
        {
            new KeyValuePair<string, string>("_csrf-frontend", _csrf_frontend ),
            new KeyValuePair<string, string>("LoginForm[username]", username),
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

    public async Task<(List<Subject>, int, string)> GetScheduleWithLinksForDayAsync(List<string> cookie, int week, int day)
    {
        HttpClient httpClient = new HttpClient();
        httpClient.DefaultRequestHeaders.Add("Cookie", string.Join(";", cookie));
        HttpResponseMessage scheduleResponse = await httpClient.GetAsync($"{ScheduleUrl}?week={week}&day={day}");
        string scheduleResponseText = await scheduleResponse.Content.ReadAsStringAsync();
        return await _personalAccountParsers.GetScheduleWithLinksForDay(scheduleResponseText);
    }
    
    public async Task<(List<Subject>, int, string)> GetScheduleWithLinksForToday(List<string> cookie)
    {
        HttpClient httpClient = new HttpClient();
        httpClient.DefaultRequestHeaders.Add("Cookie", string.Join(";", cookie));
        HttpResponseMessage scheduleResponse = await httpClient.GetAsync(ScheduleUrl);
        string scheduleResponseText = await scheduleResponse.Content.ReadAsStringAsync();
        return await _personalAccountParsers.GetScheduleWithLinksForDay(scheduleResponseText);
    }
    
    //public async Task<List<Subject>> GetMyScheduleWithLinksForToday(List<string> cookie, string group, int subGroup, int englishSubGroup, List<SelectiveSubject> selectiveSubjects)
    //{
    //    List<Subject> scheduleForToday = (await _scheduleService.GetScheduleForToday(group, subGroup, englishSubGroup, selectiveSubjects)).ToList();
    //    List<Subject> scheduleWithLinksForToday = (await GetScheduleWithLinksForToday(cookie)).ToList();
    //    return scheduleWithLinksForToday
    //        .Where(s => scheduleForToday.Any(ss => ss.Time == s.Time && ss.Cabinet == s.Cabinet && ss.Teacher == s.Teacher))
    //        .ToList();
    //}

    public async Task<string> GetMyGroupAsync(List<string> cookie)
    {
        HttpClient httpClient = new HttpClient();
        httpClient.DefaultRequestHeaders.Add("Cookie", string.Join(";", cookie));
        HttpResponseMessage mainPageResponse = await httpClient.GetAsync(BaseUrl);
        string mainPageResponseText = await mainPageResponse.Content.ReadAsStringAsync();
        return await _personalAccountParsers.GetMyGroup(mainPageResponseText);
    }

    public async Task<List<SelectiveSubject>> GetSelectiveSubjectsAsync(List<string> cookie)
    {
        HttpClient httpClient = new HttpClient();
        httpClient.DefaultRequestHeaders.Add("Cookie", string.Join(";", cookie));
        HttpResponseMessage selectiveSubjectsPageResponse = await httpClient.GetAsync(SelectiveSubjectsUrl);
        string selectiveSubjectsPageResponseText = await selectiveSubjectsPageResponse.Content.ReadAsStringAsync();
        return await _personalAccountParsers.GetSelectiveSubjects(selectiveSubjectsPageResponseText);
    }
}
