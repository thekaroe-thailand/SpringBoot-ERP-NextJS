'use client'

import { Config } from "@/app/Config";
import { ErrorInterface } from "@/app/interface/ErrorInterface";
import { ProductionInterface } from "@/app/interface/ProductionInterface"
import axios from "axios";
import { useEffect, useState } from "react"
import Swal from "sweetalert2";
import Modal from "../components/Modal";

export default function Account() {
    const [productions, setProductions] = useState<ProductionInterface[]>([]);
    const [id, setId] = useState<number>(0);
    const [price, setPrice] = useState<number>(0);
    const [name, setName] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);

    useEffect(() => {
        fetchDataProductions();
    }, []);

    const fetchDataProductions = async () => {
        try {
            const url = Config.apiUrl + '/api/productions'
            const response = await axios.get(url);

            if (response.status === 200) {
                setProductions(response.data);
            }
        } catch (err: unknown) {
            Swal.fire({
                title: 'error',
                text: (err as ErrorInterface).message,
                icon: 'error'
            })
        }
    }

    const openModal = (id: number) => {
        const production = productions.find(item => item.id === id);

        if (production) {
            setId(id);
            setPrice(production.price);
            setName(production.name);
            setShowModal(true);
        }
    }

    const closeModal = () => {
        setShowModal(false);
    }

    const handleUpdatePrice = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();

            const payload = {
                price: price
            }
            const url = Config.apiUrl + '/api/productions/updatePrice/' + id;
            const response = await axios.put(url, payload);

            if (response.status === 200) {
                fetchDataProductions();
                closeModal();
            }
        } catch (err: unknown) {
            Swal.fire({
                title: 'error',
                text: (err as ErrorInterface).message,
                icon: 'error'
            })
        }
    }

    const handleChangePrice = (value: string) => {
        if (value !== null) {
            setPrice(parseFloat(value));
        }
    }

    return (
        <>
            <div className="text-xl font-bold">บัญชี</div>
            <div>
                <h2>กำหนดราคาขายสินค้า</h2>
                <div className="table-container mt-3">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ชื่อ</th>
                                <th className="w-[100px]" style={{ textAlign: 'right' }}>ราคา</th>
                                <th className="w-[140px]">แก้ไขราคา</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productions.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td className="text-right">{item.price ?? 0}</td>
                                    <td className="flex justify-center">
                                        <button className="table-edit-btn table-action-btn"
                                            onClick={(e) => openModal(item.id)}
                                        >
                                            <i className="fa fa-pencil"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {showModal && (
                <Modal title="กำหนดราคาจำหน่าย" onClose={closeModal}>
                    <form className="flex flex-col gap-4" onSubmit={handleUpdatePrice}>
                        <div>
                            <label>ชื่อสินค้า</label>
                            <input value={name} disabled />
                        </div>
                        <div>
                            <label>ราคาจำหน่าย</label>
                            <input value={price ?? 0}
                                onChange={(e) => handleChangePrice(e.target.value)} />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={closeModal}
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
        </>
    )
}