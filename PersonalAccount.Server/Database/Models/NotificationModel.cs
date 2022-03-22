namespace PersonalAccount.Server.Database.Models
{
    public class NotificationModel : BaseModel
    {
        public string Title { get; set; }
        public string Body { get; set; }
        public Guid? UserId { get; set; }
        public virtual UserModel? User { get; set; }
    }
}
