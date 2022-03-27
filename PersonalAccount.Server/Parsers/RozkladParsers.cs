using AngleSharp;
using AngleSharp.Dom;
using PersonalAccount.Server.ViewModels;

namespace PersonalAccount.Server.Parsers
{
    public class RozkladParsers
    {
        private static AngleSharp.IConfiguration _config = Configuration.Default.WithDefaultLoader();
        private static IBrowsingContext _context = BrowsingContext.New(_config);


        public static async Task<string> GetRandomGroup(string html)
        {
            IDocument document = await _context.OpenAsync(req => req.Content(html));
            IHtmlCollection<IElement> groupsItems = document.QuerySelectorAll(".collection-item");
            Random random = new Random();
            int randomNumber = random.Next(groupsItems.Length);
            return groupsItems[randomNumber].TextContent;
        }

        public static List<Subject> GetScheduleByRozkladPairItemsForDay(List<IElement> rozkladPairItems, int subGroup)
        {
            List<Subject> subjects = new List<Subject>();
            foreach (var pairItem in rozkladPairItems)
            {
                if (pairItem.TextContent.Trim() == "")
                    continue;

                Subject subject = new Subject();
                subject.Time = pairItem.GetAttribute("hour");
                IElement subjectItem;
                try
                {
                    subjectItem = pairItem.QuerySelectorAll("div.one")[subGroup - 1];
                }
                catch
                {
                    subjectItem = pairItem;
                }
                if (string.IsNullOrEmpty(subjectItem.TextContent.Trim()))
                    continue;
                IElement roomElement = subjectItem.QuerySelector("span.room");
                subject.Cabinet = roomElement.TextContent.Trim();
                subject.Type = roomElement.ParentElement.TextContent.Replace(subject.Cabinet, "").Trim();
                subject.Name = subjectItem.QuerySelector("div.subject").TextContent;
                subject.Teacher = subjectItem.QuerySelector("div.teacher").TextContent;
                subjects.Add(subject); 
            }
            return subjects;
        }

        public static List<Day> GetScheduleFromTable(IElement currentWeekTableItem, int subGroup)
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
                List<Subject> subjects = GetScheduleByRozkladPairItemsForDay(scheduleForDayItems, subGroup);
                IElement weekDayItem = thItems[j + 1];
                string weekDay = weekDayItem.TextContent;
                IElement messageItem = weekDayItem.QuerySelector("div.message");
                if (messageItem != null)
                {
                    weekDay = $"{weekDay.Replace(messageItem.TextContent, "")} ({messageItem.TextContent})";
                }
                Day day = new Day { Name = weekDay, Subjects = subjects };
                days.Add(day);
            }
            return days;
        }

        public static async Task<List<Week>> GetScheduleForTwoWeekAsync(string html, int subGroup)
        {
            IDocument document = await _context.OpenAsync(req => req.Content(html));
            IHtmlCollection<IElement> tableItems = document.QuerySelectorAll("table.schedule");
            List<Week> schedule = new List<Week>();
            for (int i = 0; i < tableItems.Length; i++)
            {
                Week week = new Week { Name = $"{i + 1} тиждень", Days = GetScheduleFromTable(tableItems[i], subGroup) };
                schedule.Add(week);
            }
            return schedule;
        }
        
        public static async Task<List<Subject>> GetScheduleForTodayAsync(string html, int subGroup)
        {
            IDocument document = await _context.OpenAsync(req => req.Content(html));
            List<IElement> scheduleForTodayItems = document.QuerySelectorAll("td.content.selected").ToList();
            return GetScheduleByRozkladPairItemsForDay(scheduleForTodayItems, subGroup);
        }

        public static async Task<List<string>> GetAllGroup(string html)
        {
            IDocument document = await _context.OpenAsync(req => req.Content(html));
            List<IElement> groupsItems = document.QuerySelectorAll("a.collection-item").ToList();
            return groupsItems
                .Select(gI => gI.TextContent)
                .Where(g => !g.Contains("Додатково", StringComparison.OrdinalIgnoreCase) && !g.Contains("Видалити", StringComparison.OrdinalIgnoreCase))
                .ToList();
        }
    }
}
