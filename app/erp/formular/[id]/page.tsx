'use client'

import { useState, useEffect } from "react"
import { FormularInterface } from "@/app/interface/FormularInterface"
import { ProductionInterface } from "@/app/interface/ProductionInterface"
import axios from "axios"
import Swal from "sweetalert2"
import { Config } from "@/app/Config"
import { useParams } from "next/navigation"
import Modal from "../../components/Modal"
import { MaterialInterface } from "@/app/interface/Materialinterface"

export default function Formular() {
    const [formulars, setFormulars] = useState<FormularInterface[]>([]);
    const [production, setProduction] = useState<ProductionInterface | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [materials, setMaterials] = useState<MaterialInterface[]>([]);
    const [materialId, setMaterialId] = useState<number>(0);
    const [qty, setQty] = useState<number>(0);
    const [unit, setUnit] = useState<string>('');
    const { id } = useParams();

    useEffect(() => {
        fetchProduction();
        fetchMaterials();
        fetchFormulars();
    }, [])

    const fetchProduction = async () => {
        try {
            const url = Config.apiUrl + '/api/productions/' + id
            const response = await axios.get(url);

            if (response.status == 200) {
                setProduction(response.data);
            }
        } catch (err) {
            Swal.fire({
                title: 'error',
                text: (err as Error).message,
                icon: 'error'
            })
        }
    }

    const fetchMaterials = async () => {
        try {
            const url = Config.apiUrl + '/api/materials';
            const response = await axios.get(url);

            if (response.status == 200) {
                setMaterials(response.data);
                setMaterialId(response.data[0].id);
            }
        } catch (err) {
            Swal.fire({
                title: 'error',
                text: (err as Error).message,
                icon: 'error'
            })
        }
    }

    const fetchFormulars = async () => {
        try {
            const url = Config.apiUrl + '/api/formulars/' + id;
            const response = await axios.get(url);

            if (response.status == 200) {
                setFormulars(response.data);
            }
        } catch (err) {
            Swal.fire({
                title: 'error',
                text: (err as Error).message,
                icon: 'error'
            })
        }
    }

    const openModal = () => {
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);

        setQty(0);
        setUnit('');
    }

    const handleSave = async () => {
        try {
            const url = Config.apiUrl + '/api/formulars'
            const payload = {
                production: {
                    id: production?.id
                },
                material: {
                    id: materialId
                },
                qty: qty,
                unit: unit
            }
            const response = await axios.post(url, payload);

            if (response.status == 200) {
                closeModal();
                fetchFormulars();
            }
        } catch (err) {
            Swal.fire({
                title: 'error',
                text: (err as Error).message,
                icon: 'error'
            })
        }
    }

    const handleDelete = async (id: number) => {
        try {
            const confirm = await Swal.fire({
                title: 'ยืนยันการลบ',
                text: 'คุณต้องการลบส่วนผสมนี้หรือไม่',
                icon: 'question',
                showCancelButton: true,
                showConfirmButton: true
            })

            if (confirm.isConfirmed) {
                const url = Config.apiUrl + '/api/formulars/' + id;
                const response = await axios.delete(url);

                if (response.status == 200) {
                    fetchFormulars();
                }
            }
        } catch (err) {
            Swal.fire({
                title: 'error',
                text: (err as Error).message,
                icon: 'error'
            })
        }
    }

    return (
        <div>
            <h1>สูตรการผลิต {production?.name}</h1>
            <div className="flex flex-col gap-2 mt-3">
                <div>
                    <button className="button-add" onClick={openModal}>
                        <i className="fas fa-plus mr-2"></i>
                        เพิ่มส่วนผสม
                    </button>
                </div>

                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>วัตถุดิบ</th>
                                <th className="w-[100px]" style={{ textAlign: 'right' }}>จำนวน</th>
                                <th className="w-[100px]">หน่วย</th>
                                <th className="w-[50px]"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {formulars.map((formular) => (
                                <tr key={formular.id}>
                                    <td>{formular.material.name}</td>
                                    <td className="text-right">{formular.qty}</td>
                                    <td>{formular.unit}</td>
                                    <td className="text-center">
                                        <button className="table-action-btn table-delete-btn"
                                            onClick={() => handleDelete(formular.id)}>
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {showModal && (
                    <Modal title='เพิ่มส่วนผสม' onClose={closeModal}>
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                                <label htmlFor="material">วัตถุดิบ</label>
                                <select id="material" value={materialId}
                                    onChange={(e) => setMaterialId(Number(e.target.value))}>
                                    {materials.map((material) => (
                                        <option key={material.id} value={material.id}>
                                            {material.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="qty">จำนวน</label>
                                <input type="number" id="qty" value={qty}
                                    onChange={(e) => setQty(Number(e.target.value))} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="unit">หน่วย</label>
                                <input id="unit" value={unit}
                                    onChange={(e) => setUnit(e.target.value)} />
                            </div>
                            <div className="flex justify-end">
                                <button className="modal-btn modal-btn-submit" onClick={handleSave}>
                                    <i className="fa fa-check mr-2"></i>
                                    บันทึก
                                </button>
                            </div>
                        </div>
                    </Modal>
                )}
            </div>
        </div>
    )
}