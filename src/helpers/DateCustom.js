    export const formatdate = (tanggal) => {
    var today = new Date(tanggal),
        month = "" + (today.getMonth() + 1),
        day = "" + today.getDate(),
        year = today.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
    };

    export const dateNow = () => {
    var today = new Date(),
        month = "" + (today.getMonth() + 1),
        day = "" + today.getDate(),
        year = today.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
    };

    export const timeNow = () => {
    var today = new Date(),
        hours = "" + today.getHours(),
        minutes = "" + today.getMinutes();
    if (hours.length < 2) hours = "0" + hours;
    if (minutes.length < 2) minutes = "0" + minutes;

    return [hours, minutes].join(":");
    };

    export const formatTime = (tanggal) => {
    var today = new Date(tanggal),
        hours = "" + today.getHours(),
        minutes = "" + today.getMinutes();
    if (hours.length < 2) hours = "0" + hours;
    if (minutes.length < 2) minutes = "0" + minutes;

    return [hours, minutes].join(":");
    };

    export const formatdatetime = (tanggal) => {
        var today = new Date(tanggal),
        month = "" + (today.getMonth() + 1),
        day = "" + today.getDate(),
        year = today.getFullYear(),
        hours = "" + today.getHours(),
        minutes = "" + today.getMinutes();
        if (month.length < 2) month = "0" + month;
        if (day.length < 2) day = "0" + day;
        if (hours.length < 2) hours = "0" + hours;
        if (minutes.length < 2) minutes = "0" + minutes;

        var date = [year, month, day].join("-");
        var time = [hours, minutes].join(":");

        return [date, time].join(" ");
    };

    export const formatfulldatetime = (tanggal) => {
      var today = new Date(tanggal),
        month = "" + (today.getMonth() + 1),
        day = "" + today.getDate(),
        year = today.getFullYear(),
        hours = "" + today.getHours(),
        minutes = "" + today.getMinutes(),
        seconds = "" + today.getSeconds();
      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;
      if (hours.length < 2) hours = "0" + hours;
      if (minutes.length < 2) minutes = "0" + minutes;

      var date = [year, month, day].join("-");
      var time = [hours, minutes].join(":");

      return [date, time].join("T");
    };
