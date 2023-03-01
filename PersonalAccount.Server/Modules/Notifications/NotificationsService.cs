using Telegram.Bot;

namespace PersonalAccount.Server.Modules.Notifications;

public class NotificationsService : IHostedService
{
    private List<Schedule.Schedule> _schedules;
    private Timer _broadcastNotificationsTimer;
    private Timer _rebuildScheduleTimer;
    private readonly TelegramBotClient _telegramBotClient;
    private readonly ScheduleService _scheduleService;
    private readonly IServiceProvider _services;

    public NotificationsService(ScheduleService scheduleService, IServiceProvider services, Microsoft.Extensions.Configuration.IConfiguration configuration)
    {
        _schedules = new List<Schedule.Schedule>();
        _telegramBotClient = new TelegramBotClient(configuration.GetValue<string>("TELEGRAM_BOT_TOKEN"));
        _scheduleService = scheduleService;
        _services = services;
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
            var dateTime = DateTime.UtcNow;
            var dateTimeNow = new DateTime(
                dateTime.Ticks - (dateTime.Ticks % TimeSpan.TicksPerSecond),
                dateTime.Kind
            );
            DateTime dateTimeNowWithCustomPlus = dateTimeNow.AddMinutes(schedule.User.Settings.MinutesBeforeLessonsNotification);
            if (schedule.Subjects.Count > 0 && schedule.Subjects[0].StartTime == dateTimeNowWithCustomPlus)
            {
                string title = "Notification";
                string message = $"In {schedule.User.Settings.MinutesBeforeLessonsNotification}m start lessons\nFirst lesson:\n";
                message += $"<strong>{schedule.Subjects[0].Name}</strong>\n{schedule.Subjects[0].Cabinet}\n{schedule.Subjects[0].Teacher}\n{schedule.Subjects[0].Link}";

                NotificationModel notification = new NotificationModel
                {
                    Title = title,
                    Body = message,
                    UserId = schedule.User.Id,
                };
                using (var scope = _services.CreateScope())
                {
                    NotificationRepository notificationRepository = scope.ServiceProvider.GetRequiredService<NotificationRepository>();
                    await notificationRepository.CreateAsync(notification);
                }

                Console.WriteLine($"[{dateTimeNow}] Notification for {schedule.User.Email}: {message}");

                object data = new { Date = dateTimeNow };
                await SendNotificationInAllWaysAsync(title, message, data, schedule.User.Settings.TelegramAccount?.TelegramId, schedule.User.Settings.ExpoPushToken);
            }

            // send notification before lesson
            foreach (var subject in schedule.Subjects)
            {
                var currentDateTimeWithCustomPlus = dateTimeNow.AddMinutes(schedule.User.Settings.MinutesBeforeLessonNotification);
                Console.WriteLine($"[{dateTimeNow}] {schedule.User.Email}: subjectStartTime={subject.StartTime}, currentTimeWithCustomPlus={currentDateTimeWithCustomPlus}, subjectName={subject.Name}");
                if (subject.StartTime == currentDateTimeWithCustomPlus)
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
                    using (var scope = _services.CreateScope())
                    {
                        var notificationRepository = scope.ServiceProvider.GetRequiredService<NotificationRepository>();
                        await notificationRepository.CreateAsync(notification);
                    }

                    Console.WriteLine($"[{dateTimeNow}] Notification for {schedule.User.Email}: {message}");

                    object data = new { Subject = subject, Date = dateTimeNow };
                    await SendNotificationInAllWaysAsync(title, message, data, schedule.User.Settings.TelegramAccount?.TelegramId, schedule.User.Settings.ExpoPushToken);
                }
            }
        }
    }

    public async void RebuildSchedule(object _)
    {
        using var scope = _services.CreateScope();
        UserRepository userRepository = scope.ServiceProvider.GetRequiredService<UserRepository>();
        List<UserModel> users = userRepository.Get();
        _schedules.Clear();
        foreach (var user in users)
        {
            try
            {
                _schedules.Add(new Schedule.Schedule
                {
                    User = user,
                    Subjects = await GetSubjectsForUser(user),
                });
            }
            catch (Exception e)
            {
                Console.WriteLine(e.StackTrace);
                Console.WriteLine(e.Message);
            }
        }
        Console.WriteLine($"[{DateTime.UtcNow}] Schedule is rebuilt for all");
    }

    public async Task RebuildScheduleForUserAsync(Guid userId)
    {
        Schedule.Schedule schedule = _schedules.FirstOrDefault(s => s.User.Id == userId);
        using var scope = _services.CreateScope();
        UserRepository userRepository = scope.ServiceProvider.GetRequiredService<UserRepository>();
        UserModel user = await userRepository.GetByIdAsync(userId);
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
        Console.WriteLine($"[{DateTime.UtcNow}] Schedule is rebuilt for {user.Email}");
    }

    public void RemoveScheduleForUser(Guid userId)
    {
        Schedule.Schedule schedule = _schedules.FirstOrDefault(s => s.User.Id == userId);
        if (schedule != null)
        {
            Console.WriteLine($"[{DateTime.UtcNow}] Schedule is remove for {schedule.User.Email}");
            _schedules.Remove(schedule);
        }
    }

    private async Task<List<Subject>> GetSubjectsForUser(UserModel user)
    {
        if (user.Settings.PersonalAccount?.CookieList == null)
            return await _scheduleService.GetScheduleForTodayAsync(user.Settings.Group, user.Settings.SubGroup, user.Settings.EnglishSubGroup, new List<SelectiveSubject>());
        else
        {
            PersonalAccountService personalAccountService = _services.GetRequiredService<PersonalAccountService>();
            List<SelectiveSubject> selectiveSubjects = await personalAccountService.GetSelectiveSubjectsAsync(user.Settings.PersonalAccount.CookieList);
            (List<Subject>, int, string) scheduleWithLinks = await personalAccountService.GetScheduleWithLinksForToday(user.Settings.PersonalAccount.CookieList);
            int weekNumber1Or2 = scheduleWithLinks.Item2 % 2 == 0 ? 2 : 1;
            List<Subject> schedule = await _scheduleService.GetScheduleForDayAsync(weekNumber1Or2, scheduleWithLinks.Item3, user.Settings.Group, user.Settings.SubGroup, user.Settings.EnglishSubGroup, selectiveSubjects);
            schedule = scheduleWithLinks.Item1
                .Where(sWL => schedule.Any(s => s.Time == sWL.Time
                    && s.Cabinet == sWL.Cabinet
                    && s.Teacher.Contains(sWL.Teacher, StringComparison.OrdinalIgnoreCase)))
                .ToList();
            foreach (var subject in schedule)
            {
                if (subject.Name.Contains("Вибіркова дисципліна", StringComparison.OrdinalIgnoreCase))
                {
                    var subjectWithCurrentTime = scheduleWithLinks.Item1.Where(s => s.Time == subject.Time);
                    var currentSubject = subjectWithCurrentTime.FirstOrDefault(s => selectiveSubjects.Any(ss => ss.IsSelected == true && ss.Name.Contains(s.Name)));
                    if (currentSubject != null)
                    {
                        subject.StartTime = currentSubject.StartTime;
                        subject.EndTime = currentSubject.EndTime;
                        subject.Cabinet = currentSubject.Cabinet;
                        subject.Type = currentSubject.Type;
                        subject.Name = currentSubject.Name;
                        subject.Teacher = currentSubject.Teacher;
                        subject.Link = currentSubject.Link;
                    }
                }
            }
            schedule = schedule.Where(s => !s.Name.Contains("Вибіркова дисципліна")).ToList();
            return schedule;
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
        text = text.Replace("<br>", string.Empty);
        await _telegramBotClient.SendTextMessageAsync(telegramId, text, Telegram.Bot.Types.Enums.ParseMode.Html, replyMarkup: null);
    }

    public async Task SendNotificationInAllWaysAsync(string title, string body, object? data = null, long? telegramId = null, string? expoToken = null)
    {
        if (expoToken != null)
            await SendMobileNotificationAsync(expoToken, title, body, data);
        if (telegramId != null)
            await SendTelegramNotificationAsync((long)telegramId, body);
    }
}
