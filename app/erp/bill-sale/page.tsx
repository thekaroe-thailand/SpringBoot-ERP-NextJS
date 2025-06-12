'use client';

import { Config } from "@/app/Config";
import { BillSaleInterface } from "@/app/interface/BillSaleInterface";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function BillSale() {
    const [billSale, setBillSale] = useState<BillSaleInterface[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const url = Config.apiUrl + '/api/report/bill-sales';
            const response = await axios.get(url);

            if (response.status === 200) {
                setBillSale(response.data);
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Failed to fetch data",
                icon: "error"
            });
        }
    }

    return (
        <div>
            <h1>ใบเสร็จรับเงิน</h1>

            <div className="table-container">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>เลขบิล</th>
                            <th>วันที่</th>
                            <th>ยอดเงิน</th>
                            <th className="w-[80px]">ยกเลิก</th>
                        </tr>
                    </thead>
                    <tbody>
                        {billSale.map((billSale) => (
                            <tr key={billSale.id}>
                                <td>{billSale.id}</td>
                                <td>{(new Date(billSale.createdAt)).toLocaleDateString()}</td>
                                <td>{billSale.total}</td>
                                <td>
                                    <button className="bg-red-500 px-4 py-2 rounded-md text-white">
                                        <i className="fas fa-times mr-2"></i>
                                        ยกเลิก
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}