"use client"

import Link from "next/link";

export default function HomePage(){
  return (
    <div>
    Home Page
    <Link href="/dashboard">Dashboard</Link>
   
    </div>
  )
}