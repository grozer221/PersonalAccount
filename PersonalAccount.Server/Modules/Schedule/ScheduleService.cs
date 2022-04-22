namespace PersonalAccount.Server.Modules.Schedule;

public class ScheduleService
{
    public const string BaseUrl = "https://rozklad.ztu.edu.ua";
    public const string UrlGroup = BaseUrl + "/schedule/group/";
    private readonly ScheduleParsers _scheduleParsers;

    public ScheduleService(ScheduleParsers scheduleParsers)
    {
        _scheduleParsers = scheduleParsers;
    }

    public async Task<string> GetRandomGroupAsync()
    {
        HttpClient httpClient = new HttpClient();
        HttpResponseMessage groupsResponse = await httpClient.GetAsync(BaseUrl);
        string groupsResponseText = await groupsResponse.Content.ReadAsStringAsync();
        return await _scheduleParsers.GetRandomGroup(groupsResponseText);
    }
    
    public async Task<List<Week>> GetScheduleForTwoWeekAsync( string group, int subGroup, int englishSubGroup, List<SelectiveSubject> selectiveSubjects)
    {
        HttpClient httpClient = new HttpClient();
        HttpResponseMessage scheduleResponse = await httpClient.GetAsync(UrlGroup + group);
        string scheduleResponseText = await scheduleResponse.Content.ReadAsStringAsync();
        return await _scheduleParsers.GetScheduleForTwoWeeksAsync(scheduleResponseText, subGroup, englishSubGroup, selectiveSubjects); ;
    }
    
    public async Task<List<Subject>> GetScheduleForTodayAsync(string group, int subGroup, int englishSubGroup, List<SelectiveSubject> selectiveSubjects)
    {
        HttpClient httpClient = new HttpClient();
        HttpResponseMessage scheduleResponse = await httpClient.GetAsync(UrlGroup + group);
        string scheduleResponseText = await scheduleResponse.Content.ReadAsStringAsync();
        return await _scheduleParsers.GetScheduleForTodayAsync(scheduleResponseText, subGroup, englishSubGroup, selectiveSubjects);
    }
    
    public async Task<List<string>> GetAllGroupsAsync()
    {
        HttpClient httpClient = new HttpClient();
        HttpResponseMessage mainPageResponse = await httpClient.GetAsync(BaseUrl);
        string mainPageResponseText = await mainPageResponse.Content.ReadAsStringAsync();
        return await _scheduleParsers.GetAllGroup(mainPageResponseText);
    }

    public async Task<List<Subject>> GetScheduleForDayAsync(int weekNubmer, string dayName, string group, int subGroup, int englishSubGroup, List<SelectiveSubject> selectiveSubjects)
    {
        HttpClient httpClient = new HttpClient();
        HttpResponseMessage scheduleResponse = await httpClient.GetAsync(UrlGroup + group);
        string scheduleResponseText = await scheduleResponse.Content.ReadAsStringAsync();
        return await _scheduleParsers.GetScheduleForDayAsync(scheduleResponseText, weekNubmer, dayName, subGroup, englishSubGroup, selectiveSubjects);
    }
}

