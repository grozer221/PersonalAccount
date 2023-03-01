using AngleSharp;
using AngleSharp.Dom;

namespace PersonalAccount.Server.Modules.Schedule;

public class ScheduleParsers
{
    private static readonly AngleSharp.IConfiguration _config = Configuration.Default.WithDefaultLoader();
    private static readonly IBrowsingContext _context = BrowsingContext.New(_config);

    public async Task<string> GetRandomGroup(string html)
    {
        IDocument document = await _context.OpenAsync(req => req.Content(html));
        IHtmlCollection<IElement> groupsItems = document.QuerySelectorAll(".collection-item");
        Random random = new Random();
        int randomNumber = random.Next(groupsItems.Length);
        return groupsItems[randomNumber].TextContent;
    }

    public List<Subject> GetScheduleByRozkladPairItemsForDay(List<IElement> rozkladPairItems, int subGroup, int englishSubGroup, List<SelectiveSubject> selectiveSubjects)
    {
        List<Subject> subjects = new List<Subject>();
        foreach (var pairItem in rozkladPairItems)
        {
            if (pairItem.TextContent.Trim() == "")
                continue;

            Subject subject = new Subject();
            var time = pairItem.GetAttribute("hour").Split("-");
            subject.StartTime = DateTime.Parse(time[0]).GetUtcFromUkraineTimeZone();
            subject.EndTime = DateTime.Parse(time[1]).GetUtcFromUkraineTimeZone();
            IElement subjectItem;

            List<IElement> variativeItems = pairItem.QuerySelectorAll("div.variative").ToList();
            int variativeCount = variativeItems.ToList().Count;
            if (variativeCount > 1)
            {
                if (selectiveSubjects.Count > 0)
                {
                    subjectItem = variativeItems
                                             .Single(v => selectiveSubjects.Any(s =>
                                                 s.Name.Contains(v.QuerySelector("div.subject").TextContent.Trim(), StringComparison.OrdinalIgnoreCase)
                                                 && s.IsSelected == true));
                }
                else
                {
                    subjectItem = pairItem;
                }

                if (subjectItem.QuerySelectorAll("div.one").Length >= subGroup)
                {
                    subjectItem = subjectItem.QuerySelectorAll("div.one")[subGroup - 1];
                }
            }
            else if (pairItem.TextContent.Contains("Іноземна мова", StringComparison.OrdinalIgnoreCase)
                    || pairItem.TextContent.Contains("Англійська мова", StringComparison.OrdinalIgnoreCase))
            {
                if (pairItem.QuerySelectorAll("div.one").Length >= englishSubGroup)
                {
                    subjectItem = pairItem.QuerySelectorAll("div.one")[englishSubGroup - 1];
                }
                else
                {
                    subjectItem = pairItem;
                }
            }
            else
            {
                if (pairItem.QuerySelectorAll("div.one").Length >= subGroup)
                {
                    subjectItem = pairItem.QuerySelectorAll("div.one")[subGroup - 1];
                }
                else
                {
                    subjectItem = pairItem;
                }
            }

            if (string.IsNullOrEmpty(subjectItem.TextContent.Trim()))
                continue;

            subject.Teacher = subjectItem.QuerySelector("div.teacher").TextContent;
            subject.Name = subjectItem.QuerySelector("div.subject").TextContent;
            if (selectiveSubjects.Any(s => s.Name.Contains(subject.Name, StringComparison.OrdinalIgnoreCase) && s.IsSelected == false))
                continue;

            IElement roomElement = subjectItem.QuerySelector("span.room");
            subject.Cabinet = roomElement.TextContent.Trim();
            subject.Type = roomElement.ParentElement.TextContent.Replace(subject.Cabinet, "").Trim();
            subjects.Add(subject);
        }
        return subjects;
    }

    public List<Day> GetScheduleFromTable(IElement currentWeekTableItem, int subGroup, int englishSubGroup, List<SelectiveSubject> selectiveSubjects)
    {
        IHtmlCollection<IElement> trItems = currentWeekTableItem.QuerySelectorAll("tr");
        IHtmlCollection<IElement> thItems = trItems[0].QuerySelectorAll("th");
        List<IHtmlCollection<IElement>> tdItems = new List<IHtmlCollection<IElement>>();
        foreach (var trItem in trItems)
        {
            IHtmlCollection<IElement> tdRowItems = trItem.QuerySelectorAll("td");
            tdItems.Add(tdRowItems);
        }
        List<Day> days = new List<Day>();
        for (int j = 0; j < tdItems[1].Length; j++)
        {
            List<IElement> scheduleForDayItems = new List<IElement>();
            for (int i = 1; i < trItems.Length; i++)
            {
                scheduleForDayItems.Add(tdItems[i][j]);
            }
            List<Subject> subjects = GetScheduleByRozkladPairItemsForDay(scheduleForDayItems, subGroup, englishSubGroup, selectiveSubjects);
            IElement weekDayItem = thItems[j + 1];
            string weekDay = weekDayItem.TextContent;
            IElement messageItem = weekDayItem.QuerySelector("div.message");
            string? extraText = null;
            if (messageItem != null)
            {
                weekDay = weekDay.Replace(messageItem.TextContent, "");
                extraText = messageItem.TextContent;
            }
            Day day = new Day { Name = weekDay, Subjects = subjects, ExtraText = extraText };
            days.Add(day);
        }
        return days;
    }

    public async Task<List<Week>> GetScheduleForTwoWeeksAsync(string html, int subGroup, int englishSubGroup, List<SelectiveSubject> selectiveSubjects)
    {
        IDocument document = await _context.OpenAsync(req => req.Content(html));
        IHtmlCollection<IElement> tableItems = document.QuerySelectorAll("table.schedule");
        List<Week> schedule = new List<Week>();
        for (int i = 0; i < tableItems.Length; i++)
        {
            Week week = new Week { Name = $"{i + 1} тиждень", Days = GetScheduleFromTable(tableItems[i], subGroup, englishSubGroup, selectiveSubjects) };
            schedule.Add(week);
        }
        return schedule;
    }

    public async Task<List<Subject>> GetScheduleForTodayAsync(string html, int subGroup, int englishSubGroup, List<SelectiveSubject> selectiveSubjects)
    {
        IDocument document = await _context.OpenAsync(req => req.Content(html));
        List<IElement> scheduleForTodayItems = document.QuerySelectorAll("td.content.selected").ToList();
        return GetScheduleByRozkladPairItemsForDay(scheduleForTodayItems, subGroup, englishSubGroup, selectiveSubjects);
    }

    public async Task<List<string>> GetAllGroup(string html)
    {
        IDocument document = await _context.OpenAsync(req => req.Content(html));
        List<IElement> groupsItems = document.QuerySelectorAll("a.collection-item").ToList();
        return groupsItems
            .Select(gI => gI.TextContent)
            .Where(g => !g.Contains("Додатково", StringComparison.OrdinalIgnoreCase) && !g.Contains("Видалити", StringComparison.OrdinalIgnoreCase))
            .ToList();
    }

    public async Task<List<Subject>> GetScheduleForDayAsync(string html, int weekNubmer, string dayName, int subGroup, int englishSubGroup, List<SelectiveSubject> selectiveSubjects)
    {
        IDocument document = await _context.OpenAsync(req => req.Content(html));
        IHtmlCollection<IElement> tableItems = document.QuerySelectorAll("table.schedule");
        IElement currentWeek = tableItems[weekNubmer - 1];
        List<IElement> scheduleForDayItems = currentWeek.QuerySelectorAll($"td.content[day=\"{dayName} {weekNubmer}\"]").ToList();
        return GetScheduleByRozkladPairItemsForDay(scheduleForDayItems, subGroup, englishSubGroup, selectiveSubjects);
    }
}
