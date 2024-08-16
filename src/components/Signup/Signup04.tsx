"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useModal } from "@/provider/ContextProvider";
import useSignupStore from "@/store/useSignupStore";

const Signup04: React.FC = () => {
  const router = useRouter();
  const { nickname } = useSignupStore();
  const { closeModal } = useModal();

  const handleExplore = () => {
    closeModal();
    router.push("/");
  };

  return (
    <div className="s:w-[370px] s:h-[580px] w-[430px] h-[610px] relative bg-background rounded-[20px] p-4 select-none">
      <div className="text-center s:mt-1 mt-3">
        <div className="w-full h-65 pt-3 rounded-md mb-4 flex items-center justify-center overflow-hidden">
          <img
            src="/logos/welcomeImage.svg"
            alt="Welcome Image"
            className="object-contain s:w-[300px] w-[350px] s:h-[300px] h-[350px]"
          />
        </div>
      </div>
      <div className="text-center">
        <div className="text-center text-2xl font-medium text-[#ffffff]">
          {" "}
          @gather_here에 <br />
          환영해요!
        </div>
        <div className="s:mt-1 mt-2 text-center text-[#] text-[#9a9a9a] text-m">
          <span className="text-[#c3e88d]">{nickname}</span>님이 @gather_here에서
          <br /> 더 많은 경험을 할 수 있도록 도울게요
        </div>
      </div>
      <div className="s:bottom-8 bottom-9 w-full px-4 mt-9 flex justify-center items-center">
        <button
          onClick={handleExplore}
          className="s:w-[300px] w-[350px] h-[45px] ml-5 bg-[#C3E88D] text-[#343437] py-2 rounded-md transition-transform transform hover:scale-105 hover:bg-primaryStrong active:scale-95 active:bg-gray-800 active:text-gray-200"
        >
          둘러보기
        </button>
      </div>
    </div>
  );
};

export default Signup04;
