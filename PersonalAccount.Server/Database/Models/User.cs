namespace PersonalAccount.Server.Database.Models
{
    public class User : BaseModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public RoleEnum Role { get; set; }

        public string Group { get; set; }
        public int SubGroup { get; set; }

        public virtual PersonalAccount PersonalAccount { get; set; }
    }

    public enum RoleEnum
    {
        User,
        Admin,
    }
}
