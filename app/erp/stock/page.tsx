'use client'

import { Config } from "@/app/Config";
import { StoreInterface } from "@/app/interface/Storelnterface";
import axios from "axios";
import { useEffect, useState, useTransition } from "react";
import Swal from "sweetalert2";
import Modal from "../components/Modal";
import { ProductionInterface } from "@/app/interface/ProductionInterface";
import { StoreImportInterface } from "@/app/interface/StoreImportInterface";

export default function Stock() {
    const [stores, setStores] = useState<StoreInterface[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [id, setId] = useState<number>(0);
    const [name, setName] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [remark, setRemark] = useState<string>('');
    const [productions, setProductions] = useState<ProductionInterface[]>([]);
    const [productionId, setProductionId] = useState<number>(0);

    // modal import to stock
    const [showModalImport, setShowModalImport] = useState(false);
    const [totalProductionLog, setTotalProductionLog] = useState<number>(0);
    const [totalProductionLoss, setTotalProductionLoss] = useState<number>(0);
    const [totalProductionFree, setTotalProductionFree] = useState<number>(0);
    const [remarkImport, setRemarkImport] = useState<string>('');
    const [qtyImport, setQtyImport] = useState<number>(0);

    // modal history
    const [showModalHistory, setShowModalHistory] = useState(false);
    const [storeImports, setStoreImports] = useState<StoreImportInterface[]>([]);

    useEffect(() => {
        fetchStores();
        fetchProductions();
    }, [])

    const openModalHistory = (id: number) => {
        setShowModalHistory(true);
        setId(id);

        fetchStoreImports(id);
    }

    const closeModalHistory = () => {
        setShowModalHistory(false);
    }

    const fetchStoreImports = async (id: number) => {
        try {
            const url = Config.apiUrl + '/api/store/import/' + id;
            const response = await axios.get(url);

            if (response.status === 200) {
                setStoreImports(response.data);
            }
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'error',
                text: error.message
            })
        }
    }

    const fetchProductions = async () => {
        const url = Config.apiUrl + '/api/productions';

        try {
            const response = await axios.get(url);

            if (response.status === 200) {
                setProductions(response.data);
                changeProduction(response.data[0].id);
            }
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'error',
                text: error.message
            })
        }
    }

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

    const openModalImport = (id: number) => {
        setShowModalImport(true);
        setId(id);
    }

    const closeModalImport = () => {
        setShowModalImport(false);
    }

    const changeProduction = async (id: number) => {
        setProductionId(id);

        try {
            const url = Config.apiUrl + '/api/store/data-for-import/' + id;
            const response = await axios.get(url);

            if (response.status === 200) {
                const data = response.data;
                const log = data.totalProductionLog ?? 0;
                const loss = data.totalProductionLoss ?? 0;
                const free = log - loss;

                setTotalProductionLog(log);
                setTotalProductionLoss(loss);
                setTotalProductionFree(free);
            }
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'error',
                text: error.message
            })
        }
    }

    const handleImport = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const data = {
                production: {
                    id: productionId
                },
                store: {
                    id: id
                },
                qty: qtyImport,
                remark: remarkImport,
                importDate: new Date().toISOString()
            }
            const url = Config.apiUrl + '/api/store/import';
            const response = await axios.post(url, data);

            if (response.status === 200) {
                closeModalImport();

                Swal.fire({
                    icon: 'success',
                    title: 'สำเร็จ',
                    text: 'รับของเข้าสต็อกสำเร็จ',
                    timer: 1500
                })
            }
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'error',
                text: error.message
            })
        }
    }

    const handleDeleteImport = async (id: number, sotreId: number) => {
        const button = await Swal.fire({
            title: 'ยืนยันการลบ',
            text: 'คุณต้องการลบรายการนี้หรือไม่',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true
        })

        if (button.isConfirmed) {
            const url = Config.apiUrl + '/api/store/import/' + id;

            try {
                await axios.delete(url);
            } catch (error: any) {
                Swal.fire({
                    icon: 'error',
                    title: 'error',
                    text: error.message
                })
            }
        }

        openModalHistory(sotreId);
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
                                            <button onClick={() => openModalImport(store.id)}
                                                className="table-edit-btn table-action-btn">
                                                <i className="fa fa-plus mr-2"></i>
                                                รับของเข้าสต็อก
                                            </button>
                                            <button className="table-edit-btn table-action-btn"
                                                onClick={() => openModalHistory(store.id)}>
                                                <i className="fa fa-history mr-2"></i>
                                                ประวัติ
                                            </button>
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

                {showModalImport && (
                    <Modal title='รับของเข้าสต้อก' onClose={closeModalImport}>
                        <form onSubmit={(e) => handleImport(e)}>
                            <div className="flex flex-col gap-2">
                                <div>
                                    <label>สินค้าที่จะนำเข้า</label>
                                    <select className="input-field" value={productionId}
                                        onChange={(e) => changeProduction(Number(e.target.value))}>
                                        {productions.map((production) => (
                                            <option key={production.id} value={production.id}>
                                                {production.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label>จำนวนที่ผลิต</label>
                                    <input type="number" value={totalProductionLog} className="input-field" readOnly disabled />
                                </div>

                                <div>
                                    <label>เสียหาย</label>
                                    <input type="number" value={totalProductionLoss} className="input-field" readOnly disabled />
                                </div>

                                <div>
                                    <label>คงเหลือ</label>
                                    <input type="number" value={totalProductionFree} className="input-field" readOnly disabled />
                                </div>

                                <div>
                                    <label>รับของเข้าสต้อก</label>
                                    <input type="number" className="input-field"
                                        value={qtyImport}
                                        onChange={(e) => setQtyImport(Number(e.target.value))} />
                                </div>

                                <div>
                                    <label>หมายเหตุ</label>
                                    <input type="text" className="input-field" value={remarkImport}
                                        onChange={(e) => setRemarkImport(e.target.value)} />
                                </div>

                                <div className="flex justify-end gap-2">
                                    <button type="button" className="modal-btn modal-btn-cancel"
                                        onClick={closeModalImport}>
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

                {showModalHistory && (
                    <Modal title='ประวัติการรับของเข้าสต็อก' onClose={closeModalHistory} size="2xl">
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>สินค้า</th>
                                        <th>จำนวน</th>
                                        <th>หมายเหตุ</th>
                                        <th>วันที่</th>
                                        <th className="w-[60px]"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {storeImports.map((storeImport) => (
                                        <tr key={storeImport.id}>
                                            <td>{storeImport.production.name}</td>
                                            <td>{storeImport.qty}</td>
                                            <td>{storeImport.remark}</td>
                                            <td>{new Date(storeImport.importDate).toLocaleDateString()}</td>
                                            <td>
                                                <button onClick={() => handleDeleteImport(storeImport.id, storeImport.store.id)}
                                                    className="table-delete-btn table-action-btn">
                                                    <i className="fa fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Modal>
                )}
            </div>
        </div>
    )
}