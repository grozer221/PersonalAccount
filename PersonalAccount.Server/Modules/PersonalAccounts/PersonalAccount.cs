using Newtonsoft.Json;

namespace PersonalAccount.Server.Modules.PersonalAccounts;

public class PersonalAccount
{
    public string Username { get; set; }
    public string Password { get; set; }
    public string Cookie { get; set; }

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
}
