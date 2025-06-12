"use client";

import { Config } from "@/app/Config";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { ReportIncomePerMonthInterface } from "@/app/interface/ReportIncomePerMonthInterface";

export default function Report() {
    const [report, setReport] = useState<ReportIncomePerMonthInterface[]>([]);
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [arrYear, setArrYear] = useState<number[]>([]);

    useEffect(() => {
        fetchData();
        setArrYear(fetchArrYear());
    }, []);

    useEffect(() => {
        fetchData();
    }, [year]);

    const fetchArrYear = () => {
        const currentYear = new Date().getFullYear();
        const lastYear = currentYear - 5;
        const arrYear = [];

        for (let i = currentYear; i >= lastYear; i--) {
            arrYear.push(i);
        }

        return arrYear;
    }

    const fetchData = async () => {
        const url = Config.apiUrl + '/api/report/sum-income-per-month/' + year;
        const response = await axios.get(url);

        if (response.status === 200) {
            setReport(response.data);
        } else {
            Swal.fire({
                title: "Error",
                text: "Failed to fetch data",
                icon: "error"
            });
        }
    }

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold">รายงานยอดขายแยกตามเดือน</h1>
            <div className="flex gap-2 mt-5">
                <label>ปี</label>
                <select onChange={(e) => setYear(Number(e.target.value))}>
                    {arrYear.map((item) => (
                        <option key={item} value={item}>{item}</option>
                    ))}
                </select>
            </div>

            <div className="table-container mt-2">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>เดือน</th>
                            <th style={{ textAlign: "right" }}>ยอดขาย</th>
                        </tr>
                    </thead>
                    <tbody>
                        {report.map((item) => (
                            <tr key={item.month}>
                                <td>{item.month}</td>
                                <td className="text-right">
                                    {item.income.toLocaleString("th-TH", {
                                        minimumFractionDigits: 2
                                    })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}