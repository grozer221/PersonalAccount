namespace PersonalAccount.Server.Modules.Schedule;

public class Day
{
    public int Number { get; set; }
    public string? ExtraText { get; set; }
    public string Name { get; set; }
    public List<Subject> Subjects { get; set; }
}
