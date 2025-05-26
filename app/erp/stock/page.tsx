'use client'

import { Config } from "@/app/Config";
import { StoreInterface } from "@/app/interface/Storelnterface";
import axios from "axios";
import { useEffect, useState, useTransition } from "react";
import Swal from "sweetalert2";
import Modal from "../components/Modal";

export default function Stock() {
    const [stores, setStores] = useState<StoreInterface[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [id, setId] = useState<number>(0);
    const [name, setName] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [remark, setRemark] = useState<string>('');

    useEffect(() => {
        fetchStores();
    }, [])

    const fetchStores = async () => {
        const url = Config.apiUrl + '/api/store';

        try {
            const response = await axios.get(url);

            if (response.status === 200) {
                setStores(response.data);
            }
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'error',
                text: error.message
            })
        }
    }

    const openModal = () => {
        setShowModal(true);
    }

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const data = {
                name: name,
                address: address,
                remark: remark
            }
            let status = 0;
            let url = Config.apiUrl + '/api/store';

            if (id > 0) {
                url = url + '/' + id;
                const response = await axios.put(url, data);
                status = response.status;
                setId(0);
            } else {
                const response = await axios.post(url, data);
                status = response.status;
            }

            if (status === 200) {
                setShowModal(false);
                fetchStores();
            }
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'error',
                text: error.message
            })
        }
    }

    const handleDelete = async (id: number) => {
        const button = await Swal.fire({
            title: 'ยืนยันการลบ',
            text: 'คุณต้องการลบรายการนี้หรือไม่',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true
        });

        if (button.isConfirmed) {
            const url = Config.apiUrl + '/api/store/' + id;

            try {
                const response = await axios.delete(url);

                if (response.status === 200) {
                    fetchStores();
                }
            } catch (error: any) {
                Swal.fire({
                    icon: 'error',
                    title: 'error',
                    text: error.message
                })
            }
        }
    }

    const handleEdit = (store: StoreInterface) => {
        setId(store.id);
        setName(store.name);
        setAddress(store.address);
        setRemark(store.remark);
        setShowModal(true);
    }

    return (
        <div>
            <h1 className="text-2xl font-bold">คลังสินค้า</h1>
            <div className="flex flex-col gap-2 mt-3">
                <div>
                    <button className="button-add" onClick={openModal}>
                        <i className="fa-solid fa-plus me-2"></i>
                        เพิ่มรายการ
                    </button>
                </div>

                <div className="table-container mt-3">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ชื่อคลัง</th>
                                <th>ที่อยู่</th>
                                <th>หมายเหตุ</th>
                                <th className="w-[120px]"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {stores.map((store) => (
                                <tr key={store.id}>
                                    <td>{store.name}</td>
                                    <td>{store.address}</td>
                                    <td>{store.remark}</td>
                                    <td>
                                        <div className="flex gap-1 justify-center">
                                            <button onClick={() => handleEdit(store)}
                                                className="table-edit-btn table-action-btn">
                                                <i className="fa fa-pencil"></i>
                                            </button>
                                            <button onClick={() => handleDelete(store.id)}
                                                className="table-delete-btn table-action-btn">
                                                <i className="fa fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {showModal && (
                    <Modal title='เพิ่มรายการ' onClose={() => setShowModal(false)}>
                        <form onSubmit={(e) => handleSave(e)}>
                            <div className="flex flex-col gap-2">
                                <div>
                                    <label>ชื่อคลัง</label>
                                    <input type="text" className="input-field" value={name}
                                        onChange={(e) => setName(e.target.value)} />
                                </div>

                                <div>
                                    <label>ที่อยู่</label>
                                    <input type="text" className="input-field" value={address}
                                        onChange={(e) => setAddress(e.target.value)} />
                                </div>

                                <div>
                                    <label>หมายเหตุ</label>
                                    <input type="text" className="input-field" value={remark}
                                        onChange={(e) => setRemark(e.target.value)} />
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
                            </div>
                        </form>
                    </Modal>
                )}
            </div>
        </div>
    )
}