

class util
{
    constructor()
    {

    }

    getUnixTime(year, month, date, hour, minutes, seconds)
    {
        var date = new Date(year, month, date, hour, minutes, seconds);
        return date.getTime();
    }

    getUnixTimeFromDate(date)
    {
        return Math.round(date.getTime()/1000.00);   // convert from ms to s
    }

    getDateFromUnixTime(unixTime)
    {
        var date = new Date();
        date.setTime(unixTime * 1000);

        return date;
    }

    
}