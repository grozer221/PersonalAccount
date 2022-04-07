namespace PersonalAccount.Server.Database.Models
{
    public class TelegramAccountModel : BaseModel
    {
        public long TelegramId { get; set; }
        public string? Username { get; set; }
        public string Firstname { get; set; }
        public string? Lastname { get; set; }
        public string? PhotoUrl { get; set; }
        public string Hash { get; set; }
        public DateTime AuthDate { get; set; }
        public Guid? UserId { get; set; }
        public virtual UserModel? User { get; set; }
    }
}
