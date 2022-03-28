using Newtonsoft.Json;
using PersonalAccount.Server.Requests;
using PersonalAccount.Server.ViewModels;

namespace PersonalAccount.Server.GraphQL.Modules.Notifications
{
    public class NotificationsService : IHostedService
    {
        private Timer _broadcastNotificationsTimer;
        private Timer _rebuildScheduleTimer;
        private readonly UsersRepository _usersRepository;
        private List<ViewModels.Schedule> _schedules;

        public NotificationsService(UsersRepository usersRepository)
        {
            _usersRepository = usersRepository;
            _schedules = new List<ViewModels.Schedule>();
        }


        public Task StartAsync(CancellationToken cancellationToken)
        {
            _rebuildScheduleTimer = new Timer(
                 new TimerCallback(RebuildSchedule),
                 null,
                 TimeSpan.Zero,
                 TimeSpan.FromHours(1));

            _broadcastNotificationsTimer = new Timer(
                new TimerCallback(BroadcastNotifications),
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

        private async void BroadcastNotifications(object _)
        {
            foreach (var schedule in _schedules)
            {
                // send notification before lessons
                DateTime dateTimeNow = DateTime.Now;
                DateTime dateTimeNowWithCustomPlus = dateTimeNow.AddMinutes(schedule.User.MinutesBeforeLessonsNotification);
                string currentTime = $"{dateTimeNowWithCustomPlus.Hour}:{dateTimeNowWithCustomPlus.Minute}";
                if (schedule.Subjects.Count > 0 && schedule.Subjects[0].Time.Split("-")[0] == currentTime)
                {
                    string message = $"Через {schedule.User.MinutesBeforeLessonsNotification} хвилин початок пар";
                    Console.WriteLine($"[{DateTime.Now}] Notification for {schedule.User.Email}: {message}");

                    // mobile notification
                    if(schedule.User.ExpoPushToken != null)
                        await ExpoRequests.SendPush(schedule.User.ExpoPushToken, "Сповіщення", message, new { Date = DateTime.Now});
                }

                // send notification before lesson
                foreach (var subject in schedule.Subjects)
                {
                    string subjectStartTime = subject.Time.Split("-")[0];
                    DateTime currentDateTime = DateTime.Now;
                    DateTime currentDateTimeWithCustomPlus = currentDateTime.AddMinutes(schedule.User.MinutesBeforeLessonNotification);
                    string currentTimeWithCustomPlus = $"{currentDateTimeWithCustomPlus.Hour}:{currentDateTimeWithCustomPlus.Minute}";
                    if (subjectStartTime == currentTimeWithCustomPlus)
                    {
                        string message = $"{subject.Name} / {subject.Cabinet} / через {schedule.User.MinutesBeforeLessonNotification} хвилин / {subject.Teacher} / {subject.Link}";
                        Console.WriteLine($"[{DateTime.Now}] Notification for {schedule.User.Email}: {message}");

                        // mobile notification
                        if (schedule.User.ExpoPushToken != null)
                            await ExpoRequests.SendPush(schedule.User.ExpoPushToken, "Сповіщення", message, new { Subject = subject, Date = DateTime.Now });
                    }
                }
            }
            Console.WriteLine($"[{DateTime.Now}] Notification sent if needed");
        }

        private async void RebuildSchedule(object _)
        {
            List<UserModel> users = _usersRepository.Get(u => u.PersonalAccount);
            _schedules.Clear();
            foreach (var user in users)
            {
                _schedules.Add(new ViewModels.Schedule
                {
                    User = user,
                    Subjects = await GetSubjectsForUser(user),
                });
            }
            Console.WriteLine($"[{DateTime.Now}] Schedule is rebuilt for all");
        }

        public async Task RebuildScheduleForUser(Guid userId)
        {
            ViewModels.Schedule schedule = _schedules.FirstOrDefault(s => s.User.Id == userId);
            UserModel user = await _usersRepository.GetByIdAsync(userId, u => u.PersonalAccount);
            if (schedule == null)
            {
                _schedules.Add(new ViewModels.Schedule
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

        private async Task<List<Subject>> GetSubjectsForUser(UserModel user)
        {
            if (user.PersonalAccount?.CookieList == null)
                return await RozkladRequests.GetScheduleForToday(user.Group, user.SubGroup, user.EnglishSubGroup, new List<SelectiveSubject>());
            else
            {
                List<SelectiveSubject> selectiveSubjects = await PersonalAccountRequests.GetSelectiveSubjects(user.PersonalAccount.CookieList);
                //return await PersonalAccountRequests.GetMyScheduleWithLinksForToday(user.PersonalAccount.CookieList, user.Group, user.SubGroup, user.EnglishSubGroup, selectiveSubjects);
                return await PersonalAccountRequests.GetScheduleWithLinksForToday(user.PersonalAccount.CookieList);
            }
        }

    }
}
