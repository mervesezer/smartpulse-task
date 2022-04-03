// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Only GET request is allowed." });
  }

  const today = new Date();
  const todayDateFormat = `${today.getFullYear()}-${
    today.getMonth() + 1
  }-${today.getDate()}`;

  try {
    const response = await axios.get(
      "https://seffaflik.epias.com.tr/transparency/service/market/intra-day-trade-history",
      { params: { startDate: todayDateFormat, endDate: todayDateFormat } }
    );

    let data = response.data.body.intraDayTradeHistoryList;
    data = data.filter(function (item) {
      return item.conract.startsWith("PH");
    });

    const groups = {};

    data.forEach((item) => {
      if (groups[item.conract]) {
        groups[item.conract].push(item);
      } else {
        groups[item.conract] = [item];
      }
    });

    const responseData = [];

    for (const group in groups) {
      let totalProccessValue = 0;
      let totalProccessQuantity = 0;
      let date =
        group[6] +
        group[7] +
        "/" +
        group[4] +
        group[5] +
        "/20" +
        group[2] +
        group[3] +
        " " +
        group[8] +
        group[9] +
        ":00";

      groups[group].forEach((item) => {
        totalProccessValue += (item.price * item.quantity) / 10;
        totalProccessQuantity += item.quantity / 10;
      });

      let avaragePrice = totalProccessValue / totalProccessQuantity;

      responseData.push({
        totalProccessValue,
        totalProccessQuantity,
        avaragePrice,
        date,
        conract: group,
      });
    }

    return res.status(200).json(
      responseData.sort((a, b) => {
        return (
          Number(`${a.conract[8]}${a.conract[9]}`) -
          Number(`${b.conract[8]}${b.conract[9]}`)
        );
      })
    );
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
