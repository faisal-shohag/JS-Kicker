// components/Modal.tsx
import { useEffect } from 'react'
import '@/entrypoints/popup/style.css'
type ModalProps = {
  title: string
  content: string
  onClose: () => void
}

export function Modal({ title, content, onClose }: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}                     // click outside → close
    >
      <div
        className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}  // prevent close when clicking inside
      >
        <h3 className="mb-4 text-xl font-semibold text-gray-900">{title}</h3>
        <p className="mb-6 text-gray-600">{content}</p>

        <button
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="mt-6 flex justify-end">
          <button
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}