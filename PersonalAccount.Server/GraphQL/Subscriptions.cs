using GraphQL.Types;

namespace PersonalAccount.Server.GraphQL;

public class Subscriptions : ObjectGraphType
{
    public Subscriptions(IEnumerable<ISubscriptionMarker> clientSubscriptionMarkers)
    {
        Name = "Subscriptions";

        foreach (var clientSubscriptionMarker in clientSubscriptionMarkers)
        {
            var marker = clientSubscriptionMarker as ObjectGraphType<object>;
            foreach (var field in marker.Fields)
                AddField(field);
        }
    }
}
