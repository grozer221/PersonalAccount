namespace PersonalAccount.Server.Modules.Schedule;

public class Subject
{
    public DateTime StartTime { get; set; }

    public DateTime EndTime { get; set; }

    public string Time { get => $"{StartTime}-{EndTime}"; }

    public string Cabinet { get; set; }

    public string Type { get; set; }

    public string Name { get; set; }

    public string Teacher { get; set; }

    public string Link { get; set; }
}
