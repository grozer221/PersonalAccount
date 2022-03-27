namespace PersonalAccount.Server.ViewModels
{
    public class Schedule
    {
        public UserModel User { get; set; }
        public List<Subject> Subjects { get; set; }
        public List<SelectiveSubject> SelectiveSubjects { get; set; }
    }
}
