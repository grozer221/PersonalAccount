using AngleSharp;
using AngleSharp.Dom;
using PersonalAccount.Server.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PersonalAccount.Server.Parsers
{
    public class RozkladParsers
    {
        private static IConfiguration config = Configuration.Default.WithDefaultLoader();

        public static async Task<string> GetRandomGroup(string html)
        {
            IBrowsingContext context = BrowsingContext.New(config);
            IDocument document = await context.OpenAsync(req => req.Content(html));
            IHtmlCollection<IElement> groupsItems = document.QuerySelectorAll(".collection-item");
            Random random = new Random();
            int randomNumber = random.Next(groupsItems.Length);
            return groupsItems[randomNumber].TextContent;
        }

        public static async Task<string> GetCsrfFrontend(string html)
        {
            IBrowsingContext context = BrowsingContext.New(config);
            IDocument document = await context.OpenAsync(req => req.Content(html));
            string _csrf_frontend = document.QuerySelector("input[name=\"_csrf-frontend\"]").GetAttribute("value");
            return _csrf_frontend;
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
                var a = subjectItem.QuerySelector("span.room");
                subject.Cabinet = a.TextContent.Trim();
                subject.Type = subjectItem.QuerySelector("span.room").ParentElement.TextContent.Replace(subject.Cabinet, "").Trim();
                subject.Name = subjectItem.QuerySelector("div.subject").TextContent;
                string[] teacher = subjectItem.QuerySelector("div.teacher").TextContent.Split(" ");
                subject.Teacher = $"{teacher[0]} {teacher[1][0]}.{teacher[2][0]}.";
                subjects.Add(subject);
            }
            return subjects;
        }

        public static IEnumerable<Day> GetScheduleFromTable(IElement currentWeekTableItem, int subGroup)
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

        //public static async Task<IEnumerable<Subject>> GetScheduleForTomorrowAsync(string html, int subGroup)
        //{
        //    IBrowsingContext context = BrowsingContext.New(config);
        //    IDocument document = await context.OpenAsync(req => req.Content(html));
        //    IElement rozkladHeaderItem = document.QuerySelector("th.selected");
        //    var rozkladDay = rozkladHeaderItem.QuerySelector("div.message").TextContent;
        //    if (rozkladDay.Contains("завтра") || rozkladDay.Contains("початок тижня"))
        //    {
        //        IHtmlCollection<IElement> rozkladPairItems = document.QuerySelectorAll("td.content.selected");
        //        List<Subject> rozkladSubjects = GetScheduleByRozkladPairItemsForDay(rozkladPairItems.ToList(), subGroup);
        //        return rozkladSubjects;
        //    }
        //    else
        //    {
        //        var tableItems = document.QuerySelectorAll("table.schedule");
        //        List<Day> scheduleForCurrentWeek = new List<Day>();
        //        foreach (var tableItem in tableItems)
        //        {
        //            var selectedTableHeaderItem = tableItem.QuerySelector("th.selected");
        //            if (selectedTableHeaderItem != null)
        //            {
        //                scheduleForCurrentWeek = GetScheduleFromTable(tableItem, subGroup).ToList();
        //            }
        //        }
        //        string currentDay = $"{rozkladHeaderItem.TextContent.Replace(rozkladDay, "")} ({rozkladDay})";
        //        bool isFoundTotay = false;
        //        foreach (var day in scheduleForCurrentWeek)
        //        {
        //            if (isFoundTotay)
        //                return scheduleForCurrentWeek[day.Key];
        //            if (currentDay.Contains(day.Key))
        //                isFoundTotay = true;
        //        }

        //        foreach (var tableItem in tableItems)
        //        {
        //            var selectedTableHeaderItem = tableItem.QuerySelector("th.selected");
        //            if (selectedTableHeaderItem == null)
        //            {
        //                scheduleForCurrentWeek = GetScheduleFromTable(tableItem, subGroup);
        //            }
        //        }

        //        return scheduleForCurrentWeek[scheduleForCurrentWeek.ElementAt(1).Key];
        //    }
        //}

        public static async Task<IEnumerable<Week>> GetScheduleForTwoWeekAsync(string html, int subGroup)
        {
            IBrowsingContext context = BrowsingContext.New(config);
            IDocument document = await context.OpenAsync(req => req.Content(html));
            IHtmlCollection<IElement> tableItems = document.QuerySelectorAll("table.schedule");
            List<Week> schedule = new List<Week>();
            for (int i = 0; i < tableItems.Length; i++)
            {
                Week week = new Week { Name = $"{i + 1} тиждень", Days = GetScheduleFromTable(tableItems[i], subGroup) };
                schedule.Add(week);
            }
            return schedule;
        }
    }
}
