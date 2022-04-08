namespace PersonalAccount.Server.Modules.Schedule;

public class Schedule
{
    public UserModel User { get; set; }
    public List<Subject> Subjects { get; set; }
    public List<SelectiveSubject> SelectiveSubjects { get; set; }
}
