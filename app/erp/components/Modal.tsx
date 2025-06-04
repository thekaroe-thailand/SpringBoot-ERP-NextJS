'use client'
import { useEffect, useRef } from 'react'

interface ModalProps {
    id?: string
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
    title?: string
    children: React.ReactNode
    onClose: () => void
}

const Modal = ({ id, size = 'md', title, children, onClose }: ModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose()
            }
        }

        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose()
            }
        }

        document.addEventListener('keydown', handleEscape)
        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [onClose])

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-3xl',
        '3xl': 'max-w-4xl'
    }

    return (
        <div className="modal">
            <div
                ref={modalRef}
                id={id}
                className={`${sizeClasses[size]} modal-container`}
            >
                <div className="modal-header">
                    <h3 className="modal-title">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="modal-close"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Modal
