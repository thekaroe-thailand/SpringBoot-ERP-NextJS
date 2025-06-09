'use client'

import { Config } from "@/app/Config";
import { ProductionInterface } from "@/app/interface/ProductionInterface"
import axios from "axios";
import { useEffect, useState } from "react"
import Swal from "sweetalert2";
import Modal from "../components/Modal";
import { SaleTempInterface } from "@/app/interface/SaleTempInterface";

export default function Sale() {
    const [total, setTotal] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(0);
    const [discount, setDiscount] = useState<number>(0);
    const [showModalProductions, setShowModalProductions] = useState<boolean>(false);
    const [productions, setProductions] = useState<ProductionInterface[]>([]);
    const [saleTemps, setSaleTemps] = useState<SaleTempInterface[]>([]);

    useEffect(() => {
        fetchProductions();
        fetchDataSaleTemp();
    }, []);

    useEffect(() => {
        let total = 0;
        let sumQuantity = 0;

        for (const saleTemp of saleTemps) {
            total += saleTemp.price * saleTemp.qty;
            sumQuantity += saleTemp.qty;
        }

        setTotal(total);
        setQuantity(sumQuantity);
    }, [saleTemps]);

    const fetchProductions = async () => {
        try {
            const url = Config.apiUrl + '/api/productions';
            const response = await axios.get(url);

            if (response.status === 200) {
                setProductions(response.data);
            }
        } catch (error) {
            Swal.fire({
                title: 'error',
                icon: 'error',
                text: 'error : ' + error
            })
        }
    }

    const openModalProductions = () => {
        setShowModalProductions(true);
    }

    const closeModalProductions = () => {
        setShowModalProductions(false);
    }

    const getHeaders = () => {
        const headers = {
            'Authorization': 'Bearer ' + localStorage.getItem(Config.tokenKey)
        }
        return headers;
    }

    const handleChooseProduction = async (production: ProductionInterface) => {
        try {
            const url = Config.apiUrl + '/api/SaleTemp';
            const payload = {
                production: {
                    id: production.id
                }
            }
            const headers = getHeaders();
            const response = await axios.post(url, payload, { headers });

            if (response.status === 200) {
                fetchDataSaleTemp();
                closeModalProductions();
            }
        } catch (error) {
            Swal.fire({
                title: 'error',
                icon: 'error',
                text: 'error : ' + error
            })
        }
    }

    const fetchDataSaleTemp = async () => {
        try {
            const url = Config.apiUrl + '/api/SaleTemp';
            const headers = getHeaders();
            const response = await axios.get(url, { headers });

            if (response.status === 200) {
                setSaleTemps(response.data);
            }
        } catch (error) {
            Swal.fire({
                title: 'error',
                icon: 'error',
                text: 'error : ' + error
            })
        }
    }

    const handleDeleteSaleTemp = async (id: number) => {
        try {
            const buttonConfirm = await Swal.fire({
                title: 'ยืนยันการลบ',
                icon: 'question',
                showCancelButton: true,
                showConfirmButton: true
            });

            if (buttonConfirm.isConfirmed) {
                const url = Config.apiUrl + '/api/SaleTemp/' + id;
                const headers = getHeaders();
                const response = await axios.delete(url, { headers });

                if (response.status === 200) {
                    fetchDataSaleTemp();
                }
            }
        } catch (error) {
            Swal.fire({
                title: 'error',
                icon: 'error',
                text: 'error : ' + error
            })
        }
    }

    const handleUpQty = async (id: number) => {
        try {
            const url = Config.apiUrl + '/api/SaleTemp/' + id;
            const saleTemp = saleTemps.find((saleTemp) => saleTemp.id === id);

            if (saleTemp) {
                const payload = {
                    qty: saleTemp.qty + 1
                }
                const response = await axios.put(url, payload);
                if (response.status === 200) fetchDataSaleTemp();
            }
        } catch (error) {
            Swal.fire({
                title: 'error',
                icon: 'error',
                text: 'error : ' + error
            })
        }
    }

    const handleDownQty = async (id: number) => {
        try {
            const url = Config.apiUrl + '/api/SaleTemp/' + id;
            const saleTemp = saleTemps.find((saleTemp) => saleTemp.id === id);

            if (saleTemp && saleTemp.qty > 1) {
                const payload = {
                    qty: saleTemp.qty - 1
                }
                const response = await axios.put(url, payload);
                if (response.status === 200) fetchDataSaleTemp();
            }
        } catch (error) {
            Swal.fire({
                title: 'error',
                icon: 'error',
                text: 'error : ' + error
            })
        }
    }

    return (
        <div className="container">
            <h1 className="text-2xl font-bold">ขายสินค้า</h1>
            <div className="flex justify-end">
                <span className="text-2xl font-bold bg-gray-950 px-4 py-2 rounded-md
                text-green-300 border border-green-300">
                    {total.toLocaleString('th-TH', {
                        minimumFractionDigits: 2
                    })}
                </span>
            </div>

            <div className="flex flex-col gap-2">
                <div>
                    <input type="text" placeholder="กรอกรหัสสินค้า" className="form-input" />
                    <button className="button" onClick={openModalProductions}>
                        <i className="fa-solid fa-search mr-3"></i>
                        ค้นหา
                    </button>
                </div>

                <div className="flex gap-3">
                    จำนวน
                    <span className="font-bold">{saleTemps.length}</span>
                    รายการ
                    <span className="font-bold">{quantity}</span>
                    ชิ้น
                </div>
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>รหัสสินค้า</th>
                                <th>ชื่อสินค้า</th>
                                <th>ราคา</th>
                                <th>จำนวน</th>
                                <th>ราคารวม</th>
                                <th className="w-[60px]">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {saleTemps.map((saleTemp) => (
                                <tr key={saleTemp.id}>
                                    <td>{saleTemp.production.id}</td>
                                    <td>{saleTemp.production.name}</td>
                                    <td>{saleTemp.price.toLocaleString()}</td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button className="table-edit-btn table-action-btn"
                                                onClick={() => handleDownQty(saleTemp.id)}>
                                                <i className="fa-solid fa-minus"></i>
                                            </button>
                                            <span className="font-bold">{saleTemp.qty}</span>
                                            <button className="table-edit-btn table-action-btn"
                                                onClick={() => handleUpQty(saleTemp.id)}>
                                                <i className="fa-solid fa-plus"></i>
                                            </button>
                                        </div>
                                    </td>
                                    <td>{(saleTemp.price * saleTemp.qty).toLocaleString()}</td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button className="table-delete-btn table-action-btn"
                                                onClick={() => handleDeleteSaleTemp(saleTemp.id)}>
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModalProductions && (
                <Modal onClose={closeModalProductions} title='สินค้า' size='xl'>
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>เลือก</th>
                                    <th>รหัสสินค้า</th>
                                    <th>ชื่อสินค้า</th>
                                    <th>ราคา</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productions.map((production) => (
                                    <tr key={production.id}>
                                        <td>
                                            <button className="button"
                                                onClick={() => handleChooseProduction(production)}>
                                                <i className="fa-solid fa-check mr-2"></i>
                                                เลือก
                                            </button>
                                        </td>
                                        <td>{production.id}</td>
                                        <td>{production.name}</td>
                                        <td>{production.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Modal>
            )}
        </div>
    )
}