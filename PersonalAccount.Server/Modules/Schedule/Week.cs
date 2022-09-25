namespace PersonalAccount.Server.Modules.Schedule;

public class Week
{
    public int Number { get; set; }
    public string Name { get; set; }
    public IEnumerable<Day> Days { get; set; }
}
