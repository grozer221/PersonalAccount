using System.Collections.Generic;

namespace PersonalAccount.Server.ViewModels
{
    public class Day
    {
        public string Name { get; set; }
        public IEnumerable<Subject> Subjects { get; set; }
    }
}
