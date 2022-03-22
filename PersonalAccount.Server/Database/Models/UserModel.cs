namespace PersonalAccount.Server.Database.Models
{
    public class UserModel : BaseModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public RoleEnum Role { get; set; }

        public string Group { get; set; }
        public int SubGroup { get; set; }
        public string? ExpoPushToken { get; set; }

        public virtual PersonalAccountModel? PersonalAccount { get; set; }
        public virtual IEnumerable<NotificationModel> Notifications { get; set; }
    }

    public enum RoleEnum
    {
        User,
        Admin,
    }
}
