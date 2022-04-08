using GraphQL.Types;

namespace PersonalAccount.Server.GraphQL;

public class Queries : ObjectGraphType
{
    public Queries(IEnumerable<IQueryMarker> clientQueryMarkers)
    {
        Name = "Queries";

        foreach (var clientQueryMarker in clientQueryMarkers)
        {
            var marker = clientQueryMarker as ObjectGraphType<object>;
            foreach (var field in marker.Fields)
                AddField(field);
        }
    }
}
