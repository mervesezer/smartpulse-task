import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    // Yazilan api dan veriler istenen sekilde cekilir
    const response = await axios.get("/api/data");

    setData(response.data);
  };

  const formatNumber = (number) =>
    Number(number)
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Tarih
              </th>
              <th scope="col" className="px-6 py-3">
                Toplam İşlem Miktarı (MWh)
              </th>
              <th scope="col" className="px-6 py-3">
                Toplam İşlem Tutarı (TL)
              </th>
              <th scope="col" className="px-6 py-3">
                Ağırlıklı Ortalama Fiyat (TL/MWh)
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Cekilen veriler frontendte gosterilir */}
            {data.map((item) => (
              <tr
                key={item.conract}
                className="border-b odd:bg-white even:bg-gray-50"
              >
                <td className="px-6 py-4">{item.date}</td>
                <td className="px-6 py-4">
                  {formatNumber(item.totalProccessQuantity)}
                </td>
                <td className="px-6 py-4">
                  {`${formatNumber(item.totalProccessValue)} ₺`}
                </td>
                <td className="px-6 py-4">{formatNumber(item.avaragePrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
