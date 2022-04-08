namespace PersonalAccount.Server.Modules.Users;

public class UserModel : BaseModel
{
    public string Email { get; set; }
    public string Password { get; set; }
    public RoleEnum Role { get; set; }

    public string Group { get; set; }
    public int SubGroup { get; set; }
    public int EnglishSubGroup { get; set; }
    public string? ExpoPushToken { get; set; }
    public int MinutesBeforeLessonNotification { get; set; }
    public int MinutesBeforeLessonsNotification { get; set; }

    public virtual PersonalAccountModel? PersonalAccount { get; set; }
    public virtual TelegramAccountModel? TelegramAccount { get; set; }
    public virtual List<NotificationModel> Notifications { get; set; }
}

public enum RoleEnum
{
    User,
    Admin,
}
