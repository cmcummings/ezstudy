import { motion, useTime, useTransform } from "framer-motion";
import type { ButtonHTMLAttributes, InputHTMLAttributes } from "react";
import { IoPersonCircle } from "react-icons/io5";
import { AiOutlineLoading } from "react-icons/ai";
import type { RemixLinkProps } from "@remix-run/react/dist/components";
import { Link } from "@remix-run/react";

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
  );
}

export function HorizontalDivider() {
  return <div className="h-[1px] w-full bg-gray-600" /> ;
}

export function VerticalDivider({ height }: { height?: number }) {
  return <div className={`h-${height ? `[${height}px]` : "full"} w-[1px] bg-gray-600`} />;
}

export function Button({ className = "", ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button 
      className={"px-5 py-2 rounded-md border-teal-700 bg-gradient-to-b from-teal-700 to-teal-600 hover:from-teal-600 hover:to-teal-500 " + className}
      {...rest} />
  );
}

export function Avatar({ src }: { src?: string | null }) {
  if (!src) {
    return <IoPersonCircle className="rounded-full w-8 h-8" />
  }

  return (
    <img 
      src={src} 
      alt="avatar"
      className="rounded-full w-8 h-8" />  
  );
}

export function LoadingCircle() {
  const time = useTime();
  const rotate = useTransform(
    time,
    [0, 2000],
    [0, 360],
    { clamp: false }
  )

  return (
    <motion.div
      style={{ rotate }}>
      <AiOutlineLoading className="w-6 h-6" />
    </motion.div> 
  );
}

export function NavLink({ className, children, ...rest }: RemixLinkProps) {
  return <Link className={"text-teal-500 hover:text-teal-300 bg-teal-500/10 hover:bg-teal-300/30 px-3 py-1 rounded-md " + className} {...rest} >
    {children}
  </Link>
}

export function NavButton({ className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={"text-teal-500 hover:text-teal-300 bg-teal-500/10 hover:bg-teal-300/30 px-3 py-1 rounded-md " + className} {...rest} />
}