using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace PersonalAccount.Server.Database.Models
{
    public class PersonalAccount : BaseModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string Cookie { get; set; }

        [NotMapped]
        public IEnumerable<string> CookieList 
        {
            get { return JsonConvert.DeserializeObject<IEnumerable<string>>(Cookie); }
            set { Cookie = JsonConvert.SerializeObject(value); }
        }
    }
}
