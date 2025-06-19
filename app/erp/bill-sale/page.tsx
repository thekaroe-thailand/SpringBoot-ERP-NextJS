'use client';

import { Config } from "@/app/Config";
import { BillSaleDetailInterface } from "@/app/interface/BillSaleDetailInterface";
import { BillSaleInterface } from "@/app/interface/BillSaleInterface";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Modal from "../components/Modal";

export default function BillSale() {
    const [billSale, setBillSale] = useState<BillSaleInterface[]>([]);
    const [billSaleDetails, setBillSaleDetails] = useState<BillSaleDetailInterface[]>([]);
    const [showModal, setShowModal] = useState(false);

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
        } catch (_) {
            Swal.fire({
                title: "Error",
                text: "Failed to fetch data",
                icon: "error"
            });
        }
    }

    const fetchDataBillSaleDetail = async (billSaleId: number) => {
        try {
            const url = Config.apiUrl + '/api/report/bill-sale-detail/' + billSaleId;
            const response = await axios.get(url);

            if (response.status === 200) {
                setBillSaleDetails(response.data);
                setShowModal(true);
            }
        } catch (_) {
            Swal.fire({
                title: "Error",
                text: "Failed to fetch data",
                icon: "error"
            });
        }
    }

    const handleDelete = async (billSale: BillSaleInterface) => {
        const buttonConfirm = await Swal.fire({
            title: 'ยืนยันการลบ',
            text: 'คุณต้องการลบบิล ' + billSale.id + ' ใช่หรือไม่?',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true
        });

        if (buttonConfirm.isConfirmed) {
            const url = Config.apiUrl + '/api/report/bill-sale/' + billSale.id;
            const response = await axios.delete(url);

            if (response.status === 200) {
                fetchData();
            }
        }
    }

    const handlePaid = async (billSale: BillSaleInterface) => {
        const buttonConfirm = await Swal.fire({
            title: 'ยืนยันการชำระเงิน',
            text: 'คุณต้องการบันทึกการชำระเงินของบิล ' + billSale.id + ' ใช่หรือไม่?',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true
        });

        if (buttonConfirm.isConfirmed) {
            const url = Config.apiUrl + '/api/report/bill-sale/' + billSale.id;
            const response = await axios.put(url);

            if (response.status === 200) {
                fetchData();
            }
        }
    }

    return (
        <div>
            <h1>ใบเสร็จรับเงิน</h1>

            <div className="table-container">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>สถานะ</th>
                            <th>เลขบิล</th>
                            <th>วันที่</th>
                            <th>ยอดเงิน</th>
                            <th className="w-[80px]"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {billSale.map((billSale) => (
                            <tr key={billSale.id}>
                                <td>
                                    {billSale.status === 'paid' ?
                                        <div className="bg-green-600 text-white px-2 py-1 rounded-xl text-center">
                                            <i className="fa fa-check mr-2"></i>
                                            ชำระแล้ว
                                        </div>
                                        : <div className="bg-red-600 text-white px-2 py-1 rounded-xl text-center">
                                            <i className="fa fa-times mr-2"></i>
                                            ยกเลิก
                                        </div>
                                    }
                                </td>
                                <td>{billSale.id}</td>
                                <td>{(new Date(billSale.createdAt)).toLocaleDateString()}</td>
                                <td>{billSale.total}</td>
                                <td>
                                    <button onClick={() => fetchDataBillSaleDetail(billSale.id)}
                                        className="bg-blue-600 px-4 py-2 rounded-md text-white mr-1">
                                        <i className="fa fa-file mr-2"></i>
                                        ข้อมูลบิล
                                    </button>
                                    <button
                                        onClick={() => handleDelete(billSale)}
                                        className="bg-red-500 px-4 py-2 rounded-md text-white mr-1">
                                        <i className="fas fa-times mr-2"></i>
                                        ยกเลิก
                                    </button>
                                    <button
                                        onClick={() => handlePaid(billSale)}
                                        className="bg-green-600 px-4 py-2 rounded-md text-white">
                                        <i className="fa fa-check mr-2"></i>
                                        ชำระแล้ว
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal &&
                <Modal title='รายการบิลขาย' onClose={() => setShowModal(false)} size="2xl">
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>รหัสสินค้า</th>
                                    <th>รายการ</th>
                                    <th style={{ textAlign: 'right' }}>จำนวน</th>
                                    <th style={{ textAlign: 'right' }}>ราคา</th>
                                    <th style={{ textAlign: 'right' }}>ยอดรวม</th>
                                </tr>
                            </thead>
                            <tbody>
                                {billSaleDetails.map((billSaleDetail) => (
                                    <tr key={billSaleDetail.id}>
                                        <td>{billSaleDetail.production.id}</td>
                                        <td>{billSaleDetail.production.name}</td>
                                        <td className="text-right">{billSaleDetail.quantity}</td>
                                        <td className="text-right">{billSaleDetail.price.toLocaleString()}</td>
                                        <td className="text-right">
                                            {(billSaleDetail.quantity * billSaleDetail.price).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Modal>
            }
        </div>
    )
}