import { CheckCircleIcon, ExclamationCircleIcon, ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

type ToastType = 'success' | 'warning' | 'error'
type ToastItem = { id: number; message: string; type: ToastType }

const subscribers = new Set<(toasts: ToastItem[]) => void>()
let toasts: ToastItem[] = []

export const showToast = (message: string, type: ToastType = 'success') => {
  const id = Date.now() + Math.floor(Math.random() * 1000)
  const item = { id, message, type }
  toasts = [item, ...toasts]
  subscribers.forEach((s) => setTimeout(() => s(toasts), 0))
  return id
}

export const removeToast = (id: number) => {
  toasts = toasts.filter((t) => t.id !== id)
  subscribers.forEach((s) => setTimeout(() => s(toasts), 0))
}

export const ToastContainer: React.FC = () => {
  const [items, setItems] = useState<ToastItem[]>([])

  useEffect(() => {
    const sub = (next: ToastItem[]) => setItems(next)
    subscribers.add(sub)
    

  setTimeout(() => sub(toasts), 0)
    return () => { subscribers.delete(sub) }
  }, [])

  useEffect(() => {
   
    const timerIds = items.map((it) => window.setTimeout(() => removeToast(it.id), 3000))
    return () => timerIds.forEach((id) => clearTimeout(id))
  }, [items])

  if (items.length === 0) return null

  return createPortal(
    <div className="fixed right-4 top-6 z-50 flex flex-col gap-3 sub">
      {items.map((it) => (
        <div key={it.id} className={`max-w-[16rem] min-w-[16rem] min-h-xl rounded-sm  border border-gray-100 p-3 bg-white shadow-md`}>
          <div className="flex  justify-between items-center gap-3">
            <div className="flex justify-start items-center">
              <div className="text-sm font-medium">{it.type === 'success' ? (
                <>
                  <CheckCircleIcon className="w-5 h-5 text-green-700 inline-block mr-1" />
                </>
              ) : it.type === 'warning' ? (
                <>
                  <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 inline-block mr-1" />
                </>
              ) : (
                <>
                  <ExclamationCircleIcon className="w-5 h-5 text-green-700 inline-block mr-1" />
                </>
              )}</div>
              <div className="text-[13px] text-gray-700">{it.message}</div>
            </div>
            <button onClick={() => removeToast(it.id)} className="text-gray-500 text-xs cursor-pointer">
              <XMarkIcon className="w-4 h-4 outline-(primary)" />
            </button>
          </div>
        </div>
      ))}
    </div>,
    document.body
  )
}

export default ToastContainer
