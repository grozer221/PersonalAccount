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
                 TimeSpan.FromHours(1)
             );

            _broadcastNotificationsTimer = new Timer(
                new TimerCallback(BroadcastNotifications),
                null,
                TimeSpan.Zero,
                TimeSpan.FromSeconds(30)
            );

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
                int minutesBeforeLessonsNotification = 15;
                DateTime dateTimeNow = DateTime.Now;
                dateTimeNow.AddMinutes(minutesBeforeLessonsNotification);
                string currentTime = $"{dateTimeNow.Hour}:{dateTimeNow.Minute}";
                if (schedule.Subjects.Count > 0 && schedule.Subjects[0].Time.Split("-")[0] == currentTime)
                {
                    string message = $" Через {minutesBeforeLessonsNotification} хвилин початок пар";
                    Console.WriteLine($"{schedule.User.Email}: {message}");
                    if(schedule.User.ExpoPushToken != null)
                        await ExpoRequests.SendPush(schedule.User.ExpoPushToken, "Сповіщення", message, new { Date = DateTime.Now});
                }

                // send notification before lesson
                int minutesBeforeLessonNotification = 3;
                foreach (var subject in schedule.Subjects)
                {
                    string subjectStartTime = subject.Time.Split("-")[0];
                    DateTime currentDateTime = DateTime.Now;
                    currentDateTime.AddMinutes(minutesBeforeLessonNotification);
                    string currentTimeWithCustomPlus = $"{currentDateTime.Hour}:{currentDateTime.Minute}";
                    if(subjectStartTime == currentTimeWithCustomPlus)
                    {
                        string message = $"{subject.Name} / {subject.Cabinet} / через {minutesBeforeLessonNotification} хвилин / {subject.Teacher} / {subject.Link}";
                        Console.WriteLine($"{schedule.User.Email}: {message}");
                        if(schedule.User.ExpoPushToken != null)
                            await ExpoRequests.SendPush(schedule.User.ExpoPushToken, "Сповіщення", message, new { Subject = subject, Date = DateTime.Now });
                    }
                }
            }
            Console.WriteLine($"Notification sent if needed");
        }

        private async void RebuildSchedule(object _)
        {
            List<UserModel> users = _usersRepository.Get(u => u.PersonalAccount);
            _schedules.Clear();
            foreach (var user in users)
            {
                List<Subject> subjects;
                if (user.PersonalAccount?.CookieList == null)
                    subjects = await RozkladRequests.GetScheduleForToday(user.Group, user.SubGroup);
                else
                    //subjects = await PersonalAccountRequests.GetMyScheduleWithLinksForToday(user.PersonalAccount.CookieList, user.Group, user.SubGroup);
                    subjects = await PersonalAccountRequests.GetScheduleWithLinksForToday(user.PersonalAccount.CookieList);
                _schedules.Add(new ViewModels.Schedule
                {
                    User = user,
                    Subjects = subjects,
                });
            }
            Console.WriteLine($"Schedule rebuild!!");
        }
    }
}
