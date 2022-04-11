namespace PersonalAccount.Server.Modules.Users;

public class UserSettings
{
    public string? Group { get; set; }
    public int SubGroup { get; set; }
    public int EnglishSubGroup { get; set; }
    public string? ExpoPushToken { get; set; }
    public int MinutesBeforeLessonNotification { get; set; }
    public int MinutesBeforeLessonsNotification { get; set; }
    public PersonalAccounts.PersonalAccount? PersonalAccount { get; set; }
    public TelegramAccount? TelegramAccount { get; set; }
}
