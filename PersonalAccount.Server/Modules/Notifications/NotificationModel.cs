namespace PersonalAccount.Server.Modules.Notifications;

public class NotificationModel : BaseModel
{
    public string Title { get; set; }
    public string Body { get; set; }
    public Subject? Subject { get; set; }
    public Guid? UserId { get; set; }
    public virtual UserModel? User { get; set; }
}
