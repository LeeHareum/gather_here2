import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import OAuthButtons from "./OAuthButtons";

const LoginForm = () => {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (provider: "google" | "kakao" | "github") => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process?.env?.NEXT_PUBLIC_BASE_URL}/api/auth/callback`,
      },
    });
    if (error) {
      console.error(`${provider} 로그인 오류:`, error);
      setError(`Failed to log in with ${provider}. ${error.message}`);
      setLoading(false);
      return;
    }
    if (data) {
      router.push("/");
    } else {
      console.error("Login data is empty.");
      setError("Login failed. Please try again.");
    }
    setLoading(false);
  };
  return (
    <div className="flex flex-col items-center s:w-[370px] s:h-[550px] w-[430px] h-[580px] bg-background rounded-[20px] p-4 select-none ">
      <div className="w-full pt-5 pb-7 text-center text-white text-4xl font-medium leading-9">시작하기</div>
      <div className="w-full pb-8 inset-0 text-center text-[#9A9A9A] text-l font-normal leading-relaxed">
        1분만에 SNS로 가입하고 <br /> 나에게 꼭 맞는 동료들을 만나보세요!
      </div>
      {error && <div className="text-center text-red-500">{error}</div>}
      {loading ? (
        <div className="text-center">
          <span className="text-[#212121]">로그인 중...</span>
        </div>
      ) : (
        <OAuthButtons handleLogin={handleLogin} />
      )}
      <div className="w-80 text-center text-[#999999] text-xs font-medium leading-tight">
        로그인은 개인 정보 보호 정책 및 서비스 약관에 동의하는 것을 의미하며, 서비스 이용을 위해 이메일과 이름, 프로필
        이미지를 수집합니다.
      </div>
    </div>
  );
};
export default LoginForm;
