namespace PersonalAccount.Server.Modules.Schedule;

public class Week
{
    public int Number { get; set; }
    public string Name { get; set; }
    public List<Day> Days { get; set; }
}
