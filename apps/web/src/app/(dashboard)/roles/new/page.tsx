"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewRolePage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/roles");
  }, [router]);

  return null;
}
