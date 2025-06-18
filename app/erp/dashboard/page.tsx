"use client";

import { Config } from "@/app/Config";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Dashboard() {
    const [sumQty, setSumQty] = useState(0);
    const [sumIncome, setSumIncome] = useState(0);
    const [totalProduct, setTotalProduct] = useState(0);
    const [sumLoss, setSumLoss] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const url = Config.apiUrl + '/api/report/dashboard';
            const response = await axios.get(url);

            if (response.status === 200) {
                const data = response.data;
                setSumQty(data.sumQty);
                setSumIncome(data.sumIncome);
                setTotalProduct(data.totalProduct);
                setSumLoss(data.sumLoss);
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: error as string,
                icon: 'error',
            })
        }
    }
    return (
        <div>
            <div className="text-2xl font-bold mb-2">Dashboard</div>
            <div className="flex gap-2 text-end">
                <div className="flex flex-col gap-2 bg-blue-500 text-white rounded-lg p-2 w-full">
                    <div>ยอดการผลิต (ชิ้น)</div>
                    <div>{sumQty.toLocaleString()}</div>
                </div>
                <div className="flex flex-col gap-2 bg-green-700 text-white rounded-lg p-2 w-full">
                    <div>ยอดการขาย (ชิ้น)</div>
                    <div>{sumIncome.toLocaleString()}</div>
                </div>
                <div className="flex flex-col gap-2 bg-yellow-600 text-white rounded-lg p-2 w-full">
                    <div>สินค้า</div>
                    <div>{totalProduct.toLocaleString()}</div>
                </div>
                <div className="flex flex-col gap-2 bg-red-500 text-white rounded-lg p-2 w-full">
                    <div>Loss (ชิ้น)</div>
                    <div>{sumLoss.toLocaleString()}</div>
                </div>
            </div>
        </div>
    );
}