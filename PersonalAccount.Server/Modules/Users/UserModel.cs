namespace PersonalAccount.Server.Modules.Users;

public class UserModel : BaseModel
{
    public string Email { get; set; }
    public string Password { get; set; }
    public RoleEnum Role { get; set; }
    public UserSettings Settings { get; set; }

    public virtual List<NotificationModel> Notifications { get; set; }
}

public enum RoleEnum
{
    User,
    Admin,
}
