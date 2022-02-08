using System.Collections.Generic;

namespace PersonalAccount.Server.ViewModels
{
    public class Week
    {
        public string Name { get; set; }
        public IEnumerable<Day> Days { get; set; }
    }
}
