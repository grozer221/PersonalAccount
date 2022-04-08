using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;

namespace PersonalAccount.Server.Modules.PersonalAccounts;

public class PersonalAccountModel : BaseModel
{
    public string Username { get; set; }
    public string Password { get; set; }
    public string Cookie { get; set; }

    [NotMapped]
    public List<string> CookieList 
    {
        get 
        {
            if (Cookie == null)
                return new List<string>();
            else
                return JsonConvert.DeserializeObject<List<string>>(Cookie);
        }
        set 
        {
            if (value == null)
                Cookie = null;
            else
                Cookie = JsonConvert.SerializeObject(value);

        }
    }

    public Guid? UserId { get; set; }
    public virtual UserModel? User { get; set; }
}
