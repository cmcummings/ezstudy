import type { ButtonHTMLAttributes, InputHTMLAttributes } from "react";

export function Input({ className = "", ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input 
      className={"p-3 outline outline-1 outline-gray-600 focus:outline-teal-500 focus:outline-2 focus:ring-0 rounded-md bg-transparent " + className} 
      {...rest} />
  );
}

export function ErrorText({ text }: { text: string }) {
  return (
    <p className="text-red-400">
      {text}
    </p>
  )
}

export function HorizontalDivider() {
  return <div className="h-[1px] w-full bg-gray-600" /> 
}

export function VerticalDivider({ height }: { height?: number }) {
  return <div className={`h-${height ? `[${height}px]` : "full"} w-[1px] bg-gray-600`} />
}

export function Button({ className = "", ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button 
      className={"text-teal-500 hover:text-teal-300 bg-teal-500/10 hover:bg-teal-300/30 px-3 py-1 rounded-md " + className}
      {...rest} />
  );
}


export function Avatar({ src }: { src?: string | null }) {
  return <img 
    src={src ?? ""} 
    alt="avatar"
    className="rounded-full w-8 h-8" />  
}