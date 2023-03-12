# trains
My Trains Application

## Example call

```bash
# Where NR_TOKEN is the API Token from National Rail

# getDepartureBoard
sed "s/__TOKEN__/$NR_TOKEN/g" requests/getDepartureBoard | sed "s/__ORIGIN__/LEW/g" | sed "s/__DESTINATION__/LBG/g" | curl -X POST https://lite.realtime.nationalrail.co.uk/OpenLDBWS/ldb6.asmx -H "Content-Type: text/xml" -H "Accept: text/xml" --data-binary @-

sed "s/__TOKEN__/$NR_TOKEN/g" requests/getDepartureBoardWithDetails | sed "s/__ORIGIN__/LEW/g" | sed "s/__DESTINATION__/LBG/g" | curl -X POST https://lite.realtime.nationalrail.co.uk/OpenLDBWS/ldb9.asmx -H "Content-Type: text/xml" -H "Accept: text/xml" --data-binary @-
```

# TODO
- Add any information data (delays, adhoc)
- Improve the table
- Remove the Diagram
- Deploy
- Show bus info?

# Resources

https://wiki.openraildata.com/index.php?title=OpenLDBWS_SOAP_Query_Raw

https://lite.realtime.nationalrail.co.uk/OpenLDBWS/rtti_2014-02-20_ldb.wsdl
