﻿using AngleSharp;
using AngleSharp.Dom;

namespace PersonalAccount.Server.Modules.PersonalAccounts;

public class PersonalAccountParsers
{
    private static readonly AngleSharp.IConfiguration _config = Configuration.Default.WithDefaultLoader();
    private static readonly IBrowsingContext _context = BrowsingContext.New(_config);

    public async Task<string> GetCsrfFrontend(string html)
    {
        IDocument document = await _context.OpenAsync(req => req.Content(html));
        string _csrf_frontend = document.QuerySelector("input[name=\"_csrf-frontend\"]").GetAttribute("value");
        return _csrf_frontend;
    }

    public async Task<(List<Subject>, int, string)> GetScheduleWithLinksForToday(string html)
    {
        IDocument document = await _context.OpenAsync(req => req.Content(html));
        List<IElement> pairItems = document.QuerySelectorAll("div.pair").ToList();
        List<Subject> subjects = new List<Subject>();
        foreach (var pairItem in pairItems)
        {
            Subject subject = new Subject();
            subject.Link = pairItem.QuerySelector("div[style=\"font-size:1.5em;\"]").InnerHtml.Trim();
            subject.Time = subject.Time = string.Join("-", pairItem.QuerySelectorAll("div.time")[1].TextContent.Split("-").Select(t => DateTime.Parse(t).ToString("HH:mm")));
            var subjectTypes = pairItem.QuerySelectorAll("div.type");
            subject.Type = subjectTypes[0].TextContent;
            subject.Cabinet = subjectTypes[1].TextContent;
            subject.Teacher = subjectTypes[2].TextContent;
            subject.Name = pairItem.QuerySelector("div.subject").TextContent.Trim();
            subjects.Add(subject);
        }
        subjects = subjects.DistinctBy(s => new { s.Time, s.Cabinet, s.Teacher }).ToList();
        List<IElement> todayItems = document.QuerySelectorAll("span.badge.badge-primary").ToList();
        string dayName = todayItems[0].TextContent.Capitalize();
        int weekNumber = int.Parse(todayItems[1].TextContent);
        weekNumber = weekNumber % 2 == 0 ? 2 : 1;
        return (subjects, weekNumber, dayName);
    }

    public async Task<string> GetMyGroup(string html)
    {
        IDocument document = await _context.OpenAsync(req => req.Content(html));
        IElement tableItem = document.QuerySelectorAll("table.table.table-bordered ")[0];
        IElement groupTrItem = tableItem.QuerySelectorAll("tr").ToList()[4];
        return groupTrItem.QuerySelector("td").TextContent.Trim();
    }

    public async Task<List<SelectiveSubject>> GetSelectiveSubjects(string html)
    {
        IDocument document = await _context.OpenAsync(req => req.Content(html));
        IElement choiseItem = document.QuerySelector("#choise");
        List<IElement> selectiveSubjectsItems = choiseItem.QuerySelectorAll("a").ToList();
        List<SelectiveSubject> selectiveSubjects = selectiveSubjectsItems.Select(s => new SelectiveSubject { Name = s.TextContent }).ToList();

        List<string> selectedSelectiveSubjects = document
            .QuerySelectorAll("form[action=\"/site/select\"] ul li b")
            .Select(s => s.TextContent)
            .ToList();

        return selectiveSubjects
            .Select(s => selectedSelectiveSubjects.Contains(s.Name) ? new SelectiveSubject { Name = s.Name, IsSelected = true } : s)
            .ToList();
    }
}
