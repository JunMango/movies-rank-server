// const yesterday = new Date();
// yesterday.setDate(yesterday.getDate() - 1);
// const year = String(yesterday.getFullYear());
// const month = String(yesterday.getMonth() + 1).padStart(2, "0");
// const day = String(yesterday.getDate()).padStart(2, "0");
// const targetDt = `${year}${month}${day}`;
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

// 어제 날짜를 "YYYYMMDD" 형식으로 포맷팅하여 targetDt에 저장
const yearYesterday = String(yesterday.getFullYear());
const monthYesterday = String(yesterday.getMonth() + 1).padStart(2, "0");
const dayYesterday = String(yesterday.getDate()).padStart(2, "0");
const targetDt = `${yearYesterday}${monthYesterday}${dayYesterday}`;

// 지난 주의 시작일을 얻기 위한 날짜 객체 생성
const lastWeekStart = new Date(yesterday);
lastWeekStart.setDate(lastWeekStart.getDate() - lastWeekStart.getDay() - 6); // 주의 시작일을 일요일로 가정

// "YYYYMMDD" 형식으로 targetDt_week를 포맷팅
const yearWeek = String(lastWeekStart.getFullYear());
const monthWeek = String(lastWeekStart.getMonth() + 1).padStart(2, "0");
const dayWeek = String(lastWeekStart.getDate()).padStart(2, "0");
const targetDt_week = `${yearWeek}${monthWeek}${dayWeek}`;

const base_key = "key=42a45004820947923b5f5733566845cb";
const naverClientId = "eZ7Up1Ln8lrfk9vyEMIX";
const naverClientSecret = "pydS_Jmkl1";
const kmdb_Id = "WH3R0980C3A2742ASX7U";
const base_url = "http://www.kobis.or.kr/kobisopenapi/webservice/rest/";
const dailyBoxOffice =
  base_url +
  "boxoffice/searchDailyBoxOfficeList.json?" +
  base_key +
  "&targetDt=" +
  targetDt;
const weekBoxOffice =
  base_url +
  "boxoffice/searchWeeklyBoxOfficeList.json?" +
  base_key +
  "&targetDt=" +
  targetDt_week;

module.exports = {
  kmdb_Id,
  naverClientSecret,
  naverClientId,
  dailyBoxOffice,
  weekBoxOffice,
};
