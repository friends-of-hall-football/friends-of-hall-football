const schedule = require("./schedule.json").games;

// Turns "WED 8/26" into a real date in the current season year.
function parse(g) {
  const m = /(\d{1,2})\/(\d{1,2})/.exec(g.date);
  if (!m) return null;
  const year = new Date().getFullYear();
  return new Date(year, Number(m[1]) - 1, Number(m[2]));
}

const WEEKDAY = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTH = ["January","February","March","April","May","June",
               "July","August","September","October","November","December"];

module.exports = function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = schedule
    .map((g) => ({ g, d: parse(g) }))
    .filter((x) => x.d && x.d >= today)
    .sort((a, b) => a.d - b.d)[0];

  const pick = upcoming || { g: schedule[schedule.length - 1], d: parse(schedule[schedule.length - 1]) };
  const g = pick.g;
  const d = pick.d;

  const away = /^at /i.test(g.opponent);
  const opp = g.opponent.replace(/^(at|vs)\s+/i, "");

  return {
    kicker: `${WEEKDAY[d.getDay()]}, ${MONTH[d.getMonth()]} ${d.getDate()} \u00b7 ${g.type}`,
    title: away ? `Hall at ${opp}` : `Hall vs ${opp}`,
    time: g.time,
    site: String(g.site).replace(" \u2014 ", "<br>"),
    bus: g.bus || ""
  };
};
