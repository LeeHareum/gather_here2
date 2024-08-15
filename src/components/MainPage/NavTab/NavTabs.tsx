"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavTabs = () => {
  const pathname = usePathname();

  return (
    <nav className="flex space-x-4 mt-5 mb-7">
      <Link
        href="/all"
        className={`px-4 py-2 s:px-[15px] xs:px-[13px] rounded-xl ${
          pathname === "/all" ? "bg-fillStrong text-primary" : "text-labelNeutral"
        }`}
      >
        전체
      </Link>
      <Link
        href="/studies"
        className={`px-4 py-2 s:px-[15px] xs:px-[13px] rounded-xl ${
          pathname === "/studies" ? "bg-fillStrong  text-primary" : "text-labelNeutral"
        }`}
      >
        스터디
      </Link>
      <Link
        href="/projects"
        className={`px-4 py-2 s:px-[15px] xs:px-[13px] rounded-xl ${
          pathname === "/projects" ? "bg-fillStrong  text-primary" : "text-labelNeutral"
        }`}
      >
        프로젝트
      </Link>
      <Link
        href="/events"
        className={`px-4 py-2 s:px-[15px] xs:px-[13px] rounded-xl ${
          pathname === "/events" ? "bg-fillStrong  text-primary" : "text-labelNeutral"
        }`}
      >
        IT행사
      </Link>
    </nav>
  );
};

export default NavTabs;
