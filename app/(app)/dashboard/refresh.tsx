"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function Refresh() { const r = useRouter(); useEffect(() => { const i = setInterval(() => r.refresh(), 10000); return () => clearInterval(i); }, [r]); return null; }
