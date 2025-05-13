'use client'

import { useState, useEffect } from "react"
import axios from "axios"
import { Config } from "@/app/Config"
import Swal from "sweetalert2"
import Modal from "../components/Modal"
import { ProductionInterface } from "@/app/interface/ProductionInterface"

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
}