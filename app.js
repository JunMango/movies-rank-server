const express = require("express");
const axios = require("axios");
const {
  dailyBoxOffice,
  weekBoxOffice,
  naverClientId,
  naverClientSecret,
  kmdb_Id,
} = require("./const");
const app = express();
app.listen(8080, () => {
  console.log("root: http://localhost:8080");
  // console.log("영화개별:  http://localhost:8080/movie ");
  // console.log("영화리스트 상세: http://localhost:8080/movie/list");
  console.log("일별 박스 오피스: http://localhost:8080/daily/boxoffice");
  console.log("주간 박스 오피스: http://localhost:8080/week/boxoffice");
});
// async function MovieDetail(movieNm) {
//   try {
//     const response = await axios.get(
//       "http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?collection=kmdb_new2" +
//         "&title=" +
//         encodeURI(movieNm.replace(/\s/g, "")) +
//         "&detail" +
//         "N" +
//         "&ServiceKey=" +
//         kmdb_Id,
//     );
//
//     const movieData = response?.data?.Data[0]?.Result[0];
//     // movieData가 존재하고 title이 존재하는 경우에만 추출
//     const title = movieData?.title || "";
//     const plot = movieData?.plots?.plot[0]?.plotText || "";
//     const posters = movieData?.posters.split("|")[0] || "";
//     const vodClass = movieData?.vods?.vod[2] || "";
//     // 추출된 title과 plot을 사용하여 responseData 객체 생성
//     const responseData = { title, plot, posters, vodClass };
//
//     // responseData 반환
//     // res.json(responseData);
//     return JSON.stringify(responseData);
//   } catch (e) {
//     console.error("API 에러:", e);
//     res.status(500).send("서버에러");
//   }
// }
// app.get("/daily/boxoffice", async (req, res) => {
//   try {
//     const response = await axios.get(dailyBoxOffice);
//     const dailyMovies = await Promise.all(
//       response.data.boxOfficeResult.dailyBoxOfficeList.map(async (item) => ({
//         movie: await MovieDetail(item.movieNm),
//         rank: item.rank,
//       })),
//     );
//     // Sending the filtered data in the response\
//     // res.json(result);
//     res.json(dailyMovies);
//   } catch (e) {
//     console.error("API 에러:", e);
//     res.status(500).send("서버에러");
//   }
// });

// --------영화 상세 정보-------------
async function MovieDetail(movieNm) {
  try {
    const response = await axios.get(
      "http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?collection=kmdb_new2" +
        "&title=" +
        encodeURI(movieNm.replace(/\s/g, "")) +
        "&detail" +
        "N" +
        "&ServiceKey=" +
        kmdb_Id,
    );

    const movieData = response?.data?.Data[0]?.Result[0];
    // movieData가 존재하고 title이 존재하는 경우에만 추출
    const title = movieData?.title || "";
    const plot = movieData?.plots?.plot[0]?.plotText || "";
    const posters = movieData?.posters.split("|")[0] || "";
    // const vodClass = movieData?.vods?.vod[2] || "";
    const vodUrl = movieData?.vods?.vod[0]?.vodUrl || "";
    const repRlsDate = movieData?.repRlsDate || "";
    // 추출된 title과 plot을 사용하여 responseData 객체 생성
    // const responseData = { title, repRlsDate, plot, posters, vodClass };
    const responseData = { title, repRlsDate, plot, posters, vodUrl };
    // responseData 반환
    return responseData;
  } catch (e) {
    console.error("API 에러:", e);
    // throw an error instead of using res.status(500).send("서버에러");
    throw new Error("서버에러");
  }
}
// ----------일간 박스 오피스 ------------
app.get("/daily/boxoffice", async (req, res) => {
  try {
    const response = await axios.get(dailyBoxOffice);
    const dailyMovies = await Promise.all(
      response.data.boxOfficeResult.dailyBoxOfficeList.map(async (item) => ({
        title: item.movieNm, // 영화 제목
        openDt: item.openDt, // 영화 개봉일
        audiCnt: item.audiCnt, // 영화 해당일의 관객수
        audiAcc: item.audiAcc, // 영화 누적 관객수
        movie: await MovieDetail(item.movieNm), //영화 포스터, 예고편 가져오기
        rank: item.rank, // 영화 순위
      })),
    );
    // Combine the individual movie details into a single JSON object
    // const data = dailyMovies.map((movie) => ({
    //   title: movie.title, // 제목
    //   openDt: movie.openDt, //영화 개봉일
    //   audiCnt: movie.audiCnt, // 영화 해당일의 관객수
    //   audiAcc: movie.audiAcc, // 영화 누적 과객수
    //   plot: movie.movie.plot, //영화 줄거리
    //   posters: movie.movie.posters, // 영화 포스터
    //   // vodClass: movie.movie.vodClass, // 영화 예고편
    //   vodUrl: movie.movie.vodUrl, // 영화 예고편
    //   rank: movie.rank, // 영화 순위
    // }));
    const data = dailyMovies
      .filter((movie) => movie.movie.posters !== "")
      .map((movie) => ({
        title: movie.title,
        openDt: movie.openDt,
        audiCnt: movie.audiCnt,
        audiAcc: movie.audiAcc,
        plot: movie.movie.plot,
        posters: movie.movie.posters,
        vodUrl: movie.movie.vodUrl,
        rank: movie.rank,
      }));
    // Sending the combined data in the response
    res.json(data);
  } catch (e) {
    console.error("API 에러:", e);
    res.status(500).send("서버에러");
  }
});
// ----------주간 박스 오피스 ------------
app.get("/week/boxoffice", async (req, res) => {
  try {
    const response = await axios.get(weekBoxOffice);
    const weeklyMovies = await Promise.all(
      response.data.boxOfficeResult.weeklyBoxOfficeList.map(async (item) => ({
        title: item.movieNm, // 영화 제목
        openDt: item.openDt, // 영화 개봉일
        audiCnt: item.audiCnt, // 영화 해당일의 관객수
        audiAcc: item.audiAcc, // 영화 누적 관객수
        movie: await MovieDetail(item.movieNm), //영화 포스터, 예고편 가져오기
        rank: item.rank, // 영화 순위
      })),
    );
    const data = weeklyMovies
      .filter((movie) => movie.movie.posters !== "")
      .map((movie) => ({
        title: movie.title, // 제목
        openDt: movie.openDt, //영화 개봉일
        audiCnt: movie.audiCnt, // 영화 해당일의 관객수
        audiAcc: movie.audiAcc, // 영화 누적 과객수
        plot: movie.movie.plot, //영화 줄거리
        posters: movie.movie.posters, // 영화 포스터
        // vodClass: movie.movie.vodClass, // 영화 예고편
        vodUrl: movie.movie.vodUrl, // 영화 예고편
        rank: movie.rank, // 영화 순위
      }));

    // Sending the combined data in the response
    res.json(data);
  } catch (e) {
    console.error("API 에러:", e);
    res.status(500).send("서버에러");
  }
});
// app.get("/movie", async (req, res) => {
//   try {
//     // Call the DailyBoxOffice function and wait for the result
//     const movieNm = "싱글 인 서울";
//     const response = await axios.get(
//       "http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?collection=kmdb_new2" +
//         "&title=" +
//         encodeURI(movieNm.replace(/\s/g, "")) +
//         "&detail" +
//         "N" +
//         "&ServiceKey=" +
//         kmdb_Id,
//     );
//
//     const movieData = response?.data?.Data[0]?.Result[0];
//     // movieData가 존재하고 title이 존재하는 경우에만 추출
//     const title = movieData?.title || "";
//     const plot = movieData?.plots?.plot[0]?.plotText || "";
//     const posters = movieData?.posters.split("|")[0] || "";
//     const vodClass = movieData?.vods?.vod[2]?.vodUrl || "";
//     // 추출된 title과 plot을 사용하여 responseData 객체 생성
//     const responseData = { title, plot, posters, vodClass };
//
//     // responseData 반환
//     // res.json(responseData);
//     res.json(movieData);
//   } catch (e) {
//     console.error("API 에러:", e);
//     res.status(500).send("서버에러");
//   }
// });
//  naver 영화 api 서비스 종료에 의한 legacy code
// https://developers.naver.com/notice/article/9553
// function encodeToUtf8(text) {
//   const utf8Buffer = Buffer.from(text, "utf-8");
//   return utf8Buffer;
// }
// app.get("/movie", async (req, res) => {
//   try {
//     const response = await axios.get(
//       "https://openapi.naver.com/v1/search/movie.json",
//       {
//         params: { query: encodeToUtf8("서울의봄") },
//         headers: {
//           "X-Naver-Client-Id": naverClientId,
//           "X-Naver-Client-Secret": naverClientSecret,
//         },
//       },
//     );
//     res.json(response);
//   } catch (e) {
//     console.log(e);
//   }
// });
// app.get("/movie", function (req, res) {
//   var api_url =
//       "https://openapi.naver.com/v1/search/movie.json?query=" +
//       encodeURI("서울의봄"); // json 결과
//   //   var api_url = 'https://openapi.naver.com/v1/search/blog.xml?query=' + encodeURI(req.query.query); // xml 결과
//   var request = require("request");
//   var options = {
//     url: api_url,
//     headers: {
//       "X-Naver-Client-Id": naverClientId,
//       "X-Naver-Client-Secret": naverClientSecret,
//     },
//   };
//   request.get(options, function (error, response, body) {
//     if (!error && response.statusCode === 200) {
//       res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
//       res.end(body);
//     } else {
//       res.status(response.statusCode).end();
//       console.log("error = " + response.statusCode);
//     }
//   });
// });
