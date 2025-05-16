'use client'

import { useState, useEffect } from "react"
import Modal from "../components/Modal"
import axios from "axios"
import { Config } from "@/app/Config"
import Swal from "sweetalert2"
import { MaterialInterface } from "@/app/interface/Materialinterface"

export default function MaterialPage() {
    const [materials, setMaterials] = useState<MaterialInterface[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [id, setId] = useState<number>(0);
    const [name, setName] = useState<string>('');
    const [unitName, setUnitName] = useState<string>('');
    const [qty, setQty] = useState<number>(0);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const url = Config.apiUrl + '/api/materials'
            const response = await axios.get(url);

            if (response.status == 200) {
                setMaterials(response.data);
            }
        } catch (err: any) {
            Swal.fire({
                title: 'Error',
                text: err,
                icon: 'error'
            })
        }
    }

    const handleSave = async () => {
        try {
            let url = Config.apiUrl + '/api/materials'
            const payload = {
                name: name,
                unitName: unitName,
                qty: qty
            }
            let status = 0;

            if (id > 0) {
                url = Config.apiUrl + '/api/materials/' + id;
                const response = await axios.put(url, payload);
                status = response.status;
                setId(0);
            } else {
                const response = await axios.post(url, payload);
                status = response.status;
            }

            if (status == 200) {
                fetchData();
                setShowModal(false);

                Swal.fire({
                    title: 'สำเร็จ',
                    text: 'บันทึกข้อมูลสำเร็จ',
                    icon: 'success',
                    timer: 1000
                })
            }
        } catch (err: any) {
            Swal.fire({
                title: 'Error',
                text: err,
                icon: 'error'
            })
        }
    }

    const handleEdit = (id: number) => {
        const material = materials.find(m => m.id === id);

        if (material) {
            setId(material.id);
            setName(material.name);
            setUnitName(material.unitName);
            setQty(material.qty);
            setShowModal(true);
        }
    }

    const handleDelete = async (id: number) => {
        try {
            const confirm = await Swal.fire({
                title: 'ยืนยันการลบ',
                text: 'คุณต้องการลบข้อมูลใช่หรือไม่ ?',
                icon: 'question',
                showCancelButton: true,
                showConfirmButton: true
            })

            if (confirm.isConfirmed) {
                const url = Config.apiUrl + '/api/materials/' + id;
                const response = await axios.delete(url);

                if (response.status == 200) {
                    fetchData();
                }
            }
        } catch (err: any) {
            Swal.fire({
                title: 'Error',
                text: err,
                icon: 'error'
            })
        }
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-5">วัตถุดิบ</h1>
            <button onClick={() => {
                setShowModal(true)
                setName('');
                setUnitName('');
                setQty(0)
                setId(0)
            }} className="button">
                <i className="fa fa-plus mr-2"></i>
                เพิ่มรายการ
            </button>
            <div className="table-container mt-5">
                <table className="table">
                    <thead>
                        <tr>
                            <th>ชื่อ</th>
                            <th className="w-[120px]">หน่วย</th>
                            <th className="w-[120px]">จำนวน</th>
                            <th className="w-[120px]"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {materials.map(material => (
                            <tr key={material.id}>
                                <td>{material.name}</td>
                                <td>{material.unitName}</td>
                                <td>{material.qty}</td>
                                <td className="flex gap-2">
                                    <button onClick={() => handleEdit(material.id)}
                                        className="table-edit-btn table-action-btn">
                                        <i className="fa fa-pencil"></i>
                                    </button>
                                    <button onClick={() => handleDelete(material.id)}
                                        className="table-delete-btn table-action-btn">
                                        <i className="fa fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showModal && (
                <Modal title='วัตถุดิบ' onClose={() => setShowModal(false)}>
                    <div className="flex flex-col gap-2">
                        <div>
                            <label>ชื่อวัตถุดิบ</label>
                            <input type="text" value={name}
                                onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div>
                            <label>หน่วย</label>
                            <input type="text" value={unitName}
                                onChange={(e) => setUnitName(e.target.value)} />
                        </div>
                        <div>
                            <label>จำนวน</label>
                            <input type="number" value={qty}
                                onChange={(e) => setQty(Number(e.target.value || 0))} />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setShowModal(false)}
                                className="modal-btn modal-btn-cancel">
                                <i className="fas fa-times mr-2"></i>
                                ยกเลิก
                            </button>
                            <button type="submit" onClick={handleSave}
                                className="modal-btn modal-btn-submit">
                                <i className="fas fa-check mr-2"></i>
                                บันทึก
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    )
}