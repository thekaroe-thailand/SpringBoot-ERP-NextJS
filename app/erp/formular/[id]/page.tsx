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
    const [formular, setFormular] = useState<FormularInterface[]>([]);
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
    }, [])

    const fetchProduction = async () => {
        try {
            const url = Config.apiUrl + '/api/productions/' + id
            const response = await axios.get(url);

            if (response.status == 200) {
                setProduction(response.data);
            }
        } catch (err: any) {
            Swal.fire({
                title: 'error',
                text: err,
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
            }
        } catch (err: any) {
            Swal.fire({
                title: 'error',
                text: err,
                icon: 'error'
            })
        }
    }

    const openModal = () => {
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);
    }

    const handleSave = async () => {
        try {
            const url = Config.apiUrl + '/api/formulars'
            const payload = {
                productionId: production?.id,
                materialId: materialId,
                qty: qty,
                unit: unit
            }
            const response = await axios.post(url, payload);

            if (response.status == 200) {
                closeModal();
            }
        } catch (err: any) {
            Swal.fire({
                title: 'error',
                text: err,
                icon: 'error'
            })
        }
    }

    return (
        <div>
            <h1>สูตรการผลิต {production?.name}</h1>
            <div className="flex gap-2 mt-3">
                <button className="button-add" onClick={openModal}>
                    <i className="fas fa-plus mr-2"></i>
                    เพิ่มส่วนผสม
                </button>

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