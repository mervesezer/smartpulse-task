// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST request is allowed." });
  }

  const { startDate, endDate } = req.body;

  try {
    const response = await axios.get(
      "https://seffaflik.epias.com.tr/transparency/service/market/intra-day-trade-history",
      { params: { startDate, endDate } }
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
        group[2] +
        group[3] +
        "/" +
        group[4] +
        group[5] +
        "/" +
        group[6] +
        group[7] +
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
        conract,
      });
    }

    return res.status(200).json(responseData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
