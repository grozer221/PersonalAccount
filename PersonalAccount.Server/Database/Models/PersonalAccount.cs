namespace PersonalAccount.Server.Database.Models
{
    public class PersonalAccount : BaseModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string Cookie { get; set; }
    }
}
