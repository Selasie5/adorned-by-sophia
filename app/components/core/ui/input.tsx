import React from 'react'

type InputProps = {
  name:string
  label?:string
  type?:string;
  disabled?:boolean
  placeholder?:string;
  value?:string;
  onChange?:(e:React.ChangeEvent<HTMLInputElement>)=>void;
  onBlur?:(e:React.ChangeEvent<HTMLInputElement>)=>void;
  error?:any
  required?:boolean
  ref?:React.RefObject<HTMLInputElement>
}
const Input:React.FC<InputProps> = ({type,placeholder,value,onChange,onBlur ,name,label, required, error, disabled}) => {
  return (
  <div className='flex flex-col justify-center items-start gap-1 w-full'>
    <span className='text-sm text-black font-medium'>
      {label}
      {required && <span className="text-red-800">*</span>}
    </span>
 <input
 disabled={disabled}
    name={name}
    type={type|| 'text' }
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    onBlur={onBlur}
    min={type === 'date' ? new Date().toISOString().split('T')[0] : undefined}
    className={`w-full px-2 py-2.5 border text-xs border-gray-300 rounded-md  outline-none focus:border-gray-800 focus:ring-0 ${error ? 'border-red-500' : ''}`}
    />
    {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
  </div>
   
  )
}

export default Input
