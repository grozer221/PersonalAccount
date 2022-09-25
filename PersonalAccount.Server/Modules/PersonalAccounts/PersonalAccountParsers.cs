using AngleSharp;
using AngleSharp.Dom;
using System;
using System.Text.RegularExpressions;

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

    public async Task<(List<Subject>, int, string)> GetScheduleWithLinksForDay(string html)
    {
        IDocument document = await _context.OpenAsync(req => req.Content(html));
        List<IElement> pairItems = document.QuerySelectorAll("div.pair").ToList();
        List<Subject> subjects = GetSubjectsFromSubjectsItems(pairItems);
        List<IElement> dayItems = document.QuerySelectorAll(".page-item.active .page-link").ToList();
        int weekNumber = int.Parse(dayItems[0].TextContent);
        string dayName = dayItems[1].TextContent.Capitalize();
        return (subjects, weekNumber, dayName);
    }

    public List<Subject> GetSubjectsFromSubjectsItems(List<IElement> subjectItems)
    {
        List<Subject> subjects = new List<Subject>();
        foreach (var subjectItem in subjectItems)
        {
            Subject subject = new Subject();
            subject.Link = Regex.Replace(subjectItem.QuerySelector("div[style=\"font-size:1.5em;\"]").InnerHtml.Trim(), @"<\/?div.*?>", string.Empty);
            subject.Time = string.Join("-", subjectItem.QuerySelector("div.time").TextContent.Split("-").Select(t => DateTime.Parse(t).ToString("HH:mm")));
            var subjectTypes = subjectItem.QuerySelectorAll("div.type");
            subject.Name = subjectTypes[0].TextContent;
            subject.Type = subjectTypes[1].TextContent;
            subject.Cabinet = subjectTypes[2].TextContent;
            subject.Teacher = subjectTypes[3].TextContent;
            subjects.Add(subject);
        }
        return subjects.DistinctBy(s => new { s.Time, s.Cabinet, s.Teacher }).ToList();
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
            .Select(s =>
            {
                string name = Regex.Replace(s.Name, @"\s+", " ");
                return selectedSelectiveSubjects.Contains(s.Name)
                    ? new SelectiveSubject { Name = name, IsSelected = true }
                    : new SelectiveSubject { Name = name, IsSelected = s.IsSelected };
            }).ToList();
    }
}
