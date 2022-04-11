using Newtonsoft.Json;
using Telegram.Bot;

namespace PersonalAccount.Server.Modules.Notifications;

public class NotificationsService : IHostedService
{
    private List<Schedule.Schedule> _schedules;
    private Timer _broadcastNotificationsTimer;
    private Timer _rebuildScheduleTimer;
    private readonly UserRepository _usersRepository;
    private readonly NotificationRepository _notificationRepository;
    private readonly TelegramBotClient _client;
    private readonly ScheduleService _scheduleService;
    private readonly PersonalAccountService _personalAccountService;

    public NotificationsService(UserRepository usersRepository, NotificationRepository notificationRepository, ScheduleService scheduleService, PersonalAccountService personalAccountService)
    {
        _schedules = new List<Schedule.Schedule>();
        _usersRepository = usersRepository;
        _notificationRepository = notificationRepository;
        _client = new TelegramBotClient(Environment.GetEnvironmentVariable("TELEGRAM_BOT_TOKEN"));
        _scheduleService = scheduleService;
        _personalAccountService = personalAccountService;
    }


    public Task StartAsync(CancellationToken cancellationToken)
    {
        _rebuildScheduleTimer = new Timer(
             new TimerCallback(RebuildSchedule),
             null,
             TimeSpan.Zero,
             TimeSpan.FromHours(1));

        _broadcastNotificationsTimer = new Timer(
            new TimerCallback(BroadcastScheduleNotifications),
            null,
            TimeSpan.Zero,
            TimeSpan.FromSeconds(60));

        return Task.CompletedTask;
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        _rebuildScheduleTimer?.Change(Timeout.Infinite, 0);
        _broadcastNotificationsTimer?.Change(Timeout.Infinite, 0);
        return Task.CompletedTask;
    }

    private async void BroadcastScheduleNotifications(object _)
    {
        foreach (var schedule in _schedules)
        {
            // send notification before lessons
            DateTime dateTimeNow = DateTime.Now;
            DateTime dateTimeNowWithCustomPlus = dateTimeNow.AddMinutes(schedule.User.Settings.MinutesBeforeLessonsNotification);
            string currentTime = $"{dateTimeNowWithCustomPlus.Hour}:{dateTimeNowWithCustomPlus.Minute}";
            if (schedule.Subjects.Count > 0 && schedule.Subjects[0].Time.Split("-")[0] == currentTime)
            {
                string title = "Notification";
                string message = $"In {schedule.User.Settings.MinutesBeforeLessonsNotification}m start lessons\nFirst lesson:";
                message = $"<strong>{schedule.Subjects[0].Name}</strong>\n{schedule.Subjects[0].Cabinet}\n{schedule.Subjects[0].Teacher}\n{schedule.Subjects[0].Link}";

                NotificationModel notification = new NotificationModel
                {
                    Title = title,
                    Body = message,
                    UserId = schedule.User.Id,
                };
                await _notificationRepository.CreateAsync(notification);

                Console.WriteLine($"[{DateTime.Now}] Notification for {schedule.User.Email}: {message}");

                object data = new { Date = DateTime.Now };
                await SendNotificationInAllWaysAsync(title, message, data, schedule.User.Settings.TelegramAccount?.TelegramId, schedule.User.Settings.ExpoPushToken);
            }

            // send notification before lesson
            foreach (var subject in schedule.Subjects)
            {
                string subjectStartTime = subject.Time.Split("-")[0];
                DateTime currentDateTime = DateTime.Now;
                DateTime currentDateTimeWithCustomPlus = currentDateTime.AddMinutes(schedule.User.Settings.MinutesBeforeLessonNotification);
                string currentTimeWithCustomPlus = $"{currentDateTimeWithCustomPlus.Hour}:{currentDateTimeWithCustomPlus.Minute}";
                if (subjectStartTime == currentTimeWithCustomPlus)
                {
                    string title = "Notification";
                    string message = $"<strong>{subject.Name}</strong>\n{subject.Cabinet}\nin {schedule.User.Settings.MinutesBeforeLessonNotification}m\n{subject.Teacher}\n{subject.Link}";
                    NotificationModel notification = new NotificationModel
                    {
                        Title = title,
                        Body = message,
                        Subject = subject,
                        UserId = schedule.User.Id,
                    };
                    await _notificationRepository.CreateAsync(notification);

                    Console.WriteLine($"[{DateTime.Now}] Notification for {schedule.User.Email}: {message}");

                    object data = new { Subject = subject, Date = DateTime.Now };
                    await SendNotificationInAllWaysAsync(title, message, data, schedule.User.Settings.TelegramAccount?.TelegramId, schedule.User.Settings.ExpoPushToken);
                }
            }
        }
        Console.WriteLine($"[{DateTime.Now}] Notification sent if needed");
    }

    private async void RebuildSchedule(object _)
    {
        List<UserModel> users = _usersRepository.Get();
        _schedules.Clear();
        foreach (var user in users)
        {
            _schedules.Add(new Schedule.Schedule
            {
                User = user,
                Subjects = await GetSubjectsForUser(user),
            });
        }
        Console.WriteLine($"[{DateTime.Now}] Schedule is rebuilt for all");
        Console.WriteLine(JsonConvert.SerializeObject(_schedules));
    }

    public async Task RebuildScheduleForUserAsync(Guid userId)
    {
        Schedule.Schedule schedule = _schedules.FirstOrDefault(s => s.User.Id == userId);
        UserModel user = await _usersRepository.GetByIdAsync(userId);
        if (schedule == null)
        {
            _schedules.Add(new Schedule.Schedule
            {
                User = user,
                Subjects = await GetSubjectsForUser(user),
            });
        }
        else
        {
            schedule.Subjects = await GetSubjectsForUser(user);
        }
        Console.WriteLine($"[{DateTime.Now}] Schedule is rebuilt for {user.Email}");
    }
    
    public void RemoveScheduleForUser(Guid userId)
    {
        Schedule.Schedule schedule = _schedules.FirstOrDefault(s => s.User.Id == userId);
        if (schedule != null)
        {
            Console.WriteLine($"[{DateTime.Now}] Schedule is remove for {schedule?.User.Email}");
            _schedules.Remove(schedule);
        }
    }

    private async Task<List<Subject>> GetSubjectsForUser(UserModel user)
    {
        if (user.Settings.PersonalAccount?.CookieList == null)
            return await _scheduleService.GetScheduleForToday(user.Settings.Group, user.Settings.SubGroup, user.Settings.EnglishSubGroup, new List<SelectiveSubject>());
        else
        {
            List<SelectiveSubject> selectiveSubjects = await _personalAccountService.GetSelectiveSubjects(user.Settings.PersonalAccount.CookieList);
            //return await PersonalAccountRequests.GetMyScheduleWithLinksForToday(user.Settings.PersonalAccount.CookieList, user.Settings.Group, user.Settings.SubGroup, user.Settings.EnglishSubGroup, selectiveSubjects);
            return await _personalAccountService.GetScheduleWithLinksForToday(user.Settings.PersonalAccount.CookieList);
        }
    }

    public async Task SendMobileNotificationAsync(string toToken, string title, string body, object? data = null)
    {
        await new HttpClient().PostAsJsonAsync("https://api.expo.dev/v2/push/send", new
        {
            To = toToken,
            Title = title,
            Body = body,
            Data = data,
            Sound = "default",
        });
    }

    public async Task SendTelegramNotificationAsync(long telegramId, string text)
    {
        await _client.SendTextMessageAsync(telegramId, text, Telegram.Bot.Types.Enums.ParseMode.Html, replyMarkup: null);
    }

    public async Task SendNotificationInAllWaysAsync(string title, string body, object? data = null, long? telegramId = null, string? expoToken = null)
    {
        if(expoToken != null)
            await SendMobileNotificationAsync(expoToken, title, body, data);
        if(telegramId != null)
            await SendTelegramNotificationAsync((long)telegramId, body);
    }
}
