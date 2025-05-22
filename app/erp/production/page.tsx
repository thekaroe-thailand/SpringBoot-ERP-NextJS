'use client'

import React, { useState, useEffect } from "react"
import axios from "axios"
import { Config } from "@/app/Config"
import Swal from "sweetalert2"
import Modal from "../components/Modal"
import { ProductionInterface } from "@/app/interface/ProductionInterface"
import Link from 'next/link';

export default function Productlion() {
    const [productions, setProductions] = useState<ProductionInterface[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingProduction, setEditingProduction] = useState<ProductionInterface | null>(null);
    const [name, setName] = useState('');
    const [detail, setDetail] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem(Config.tokenKey);
            const headers = {
                'Authorization': 'Bearer ' + token
            }
            const response = await axios.get(`${Config.apiUrl}/api/productions`, { headers });

            if (response.status === 200) {
                setProductions(response.data);
            }
        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message
            })
        }
    }

    const handleAdd = () => {
        setEditingProduction(null);
        setName('');
        setDetail('');
        setShowModal(true);
    }

    const handleEdit = (production: ProductionInterface) => {
        setEditingProduction(production);
        setName(production.name);
        setDetail(production.detail);
        setShowModal(true);
    }

    const handleDelete = async (production: ProductionInterface) => {
        try {
            const result = await Swal.fire({
                icon: 'question',
                title: 'ยืนยันการลบ',
                text: 'คุณแน่ใจหรือที่จะลบ ?',
                showCancelButton: true,
                showConfirmButton: true
            })

            if (result.isConfirmed) {
                const token = localStorage.getItem(Config.tokenKey);
                await axios.delete(`${Config.apiUrl}/api/productions/${production.id}`, {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                })

                fetchData();
                Swal.fire({
                    icon: 'success',
                    title: 'สำเร็จ',
                    text: 'ลบข้อมูลแล้วเรียบร้อย',
                    timer: 1000
                })
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'ไม่สามารถลบช้อมูลได้ ' + err
            })
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem(Config.tokenKey);
            const data = {
                name: name,
                detail: detail
            }
            const headers = {
                'Authorization': 'Bearer ' + token
            }

            if (editingProduction) {
                const url = `${Config.apiUrl}/api/productions/${editingProduction.id}`
                await axios.put(url, data, { headers })
            } else {
                const url = `${Config.apiUrl}/api/productions`
                await axios.post(url, data, { headers })
            }

            setShowModal(false);
            fetchData();

            Swal.fire({
                icon: 'success',
                title: 'สำเร็จ',
                text: 'บันทึกข้อมุลการผลิตเรียบร้อยแล้ว',
                timer: 1000
            })
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'error ' + err
            })
        }
    }

    return (
        <div className="container">
            <h1 className="text-2xl font-bold mb-5">จัดการข้อมูลการผลิต</h1>
            <div className="flex mb-6 gap-2">
                <button className="button-add" onClick={handleAdd}>
                    <i className="fas fa-plus mr-2"></i>
                    เพิ่มรายการสินค้า
                </button>
                <Link href="/erp/material" className="button">
                    <i className="fas fa-box mr-2"></i>
                    วัตถุดิบ
                </Link>
            </div>

            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th className="w-[200px]">ชื่อสินค้า</th>
                            <th>รายละเอียด</th>
                            <th className="w-[120px]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productions.map((production) => (
                            <tr key={production.id}>
                                <td>{production.name}</td>
                                <td>{production.detail}</td>
                                <td className="flex gap-2">
                                    <Link href={`/erp/formular/${production.id}`} className="button">
                                        <i className="fas fa-file-alt mr-2"></i>
                                        สูตร
                                    </Link>
                                    <Link href={`/erp/production/log/${production.id}`} className="button">
                                        <i className="fas fa-check mr-2"></i>
                                        บันทึกการผลิต
                                    </Link>
                                    <Link href={`/erp/production/loss/${production.id}`} className="button">
                                        <i className="fas fa-file-alt mr-2"></i>
                                        บันทึก loss
                                    </Link>
                                    <button className="table-action-btn table-edit-btn"
                                        onClick={() => handleEdit(production)}
                                    >
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button className="table-action-btn table-delete-btn"
                                        onClick={() => handleDelete(production)}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <Modal id="production-modal" title="ข้อมูลการผลิต" onClose={() => setShowModal(false)} size="md">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block mb-2">ชื่อสินค้า</label>
                            <input type="text" className="form-input" value={name}
                                onChange={e => setName(e.target.value)} />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">รายละเอียด</label>
                            <input type="text" className="form-input" value={detail}
                                onChange={e => setDetail(e.target.value)} />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setShowModal(false)}
                                className="modal-btn modal-btn-cancel">
                                <i className="fas fa-times mr-2"></i>
                                ยกเลิก
                            </button>
                            <button type="submit" className="modal-btn modal-btn-submit">
                                <i className="fas fa-check mr-2"></i>
                                บันทึก
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    )
}



























