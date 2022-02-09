using AngleSharp;
using AngleSharp.Dom;
using PersonalAccount.Server.ViewModels;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PersonalAccount.Server.Parsers
{
    public static class PersonalAccountParsers
    {
        private static IConfiguration config = Configuration.Default.WithDefaultLoader();

        public static async Task<string> GetCsrfFrontend(string html)
        {
            IBrowsingContext context = BrowsingContext.New(config);
            IDocument document = await context.OpenAsync(req => req.Content(html));
            string _csrf_frontend = document.QuerySelector("input[name=\"_csrf-frontend\"]").GetAttribute("value");
            return _csrf_frontend;
        }
        
        public static async Task<IEnumerable<Subject>> GetScheduleWithLinksForToday(string html)
        {
            IBrowsingContext context = BrowsingContext.New(config);
            IDocument document = await context.OpenAsync(req => req.Content(html));
            List<IElement> pairItems = document.QuerySelectorAll("div.pair").ToList();
            List<Subject> subjects = new List<Subject>();
            foreach(var pairItem in pairItems)
            {
                Subject subject = new Subject();
                subject.Link = pairItem.QuerySelector("div[style=\"font-size:1.5em;\"]").TextContent.Trim();
                subject.Time = pairItem.QuerySelectorAll("div.time")[1].TextContent;
                var subjectTypes = pairItem.QuerySelectorAll("div.type");
                subject.Type = subjectTypes[0].TextContent;
                subject.Cabinet = subjectTypes[1].TextContent;
                subject.Teacher = subjectTypes[2].TextContent;
                subject.Name = pairItem.QuerySelector("div.subject").TextContent.Trim();
                subjects.Add(subject);
            }
            return subjects;
        }
    }
}
