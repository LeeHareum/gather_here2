"use client";
import { createClient } from "@/utils/supabase/client";
import useSignupStore from "@/store/useSignupStore";
import React, { useState, ChangeEvent, useEffect } from "react";
import { useUser } from "@/provider/UserContextProvider";

interface Signup03Type {
  setUserData: (data: any) => void;
}

const Signup03: React.FC<Signup03Type> = ({ setUserData }) => {
  const supabase = createClient();
  const {
    nextStep,
    prevStep,
    setNickname,
    setBlog,
    setProfileImageUrl,
    user,
    job_title,
    experience,
    profile_image_url,
    setUser,
  } = useSignupStore();
  const [nickname, setLocalNickname] = useState<string>("");
  const [blog, setLocalBlog] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [nicknameAvailable, setNicknameAvailable] = useState<boolean | null>(null);
  const [blogError, setBlogError] = useState<string | null>(null);
  const [isFormComplete, setIsFormComplete] = useState<boolean>(false);

  useEffect(() => {
    if (user?.user_metadata?.avatar_url) {
      setProfileImageUrl(user.user_metadata.avatar_url);
    }
  }, [user, setProfileImageUrl]);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
    };

    fetchUser();
  }, [setUser]);

  const checkNicknameAvailability = async (nickname: string) => {
    const { data, error } = await supabase.from("Users").select("nickname").eq("nickname", nickname);

    if (error) {
      console.error("Error checking nickname availability:", error);
      return;
    }

    setNicknameAvailable(data.length === 0);
  };

  const handleNext = async () => {
    if (!user?.email) {
      setError("유효한 이메일을 확인할 수 없습니다.");
      return;
    }

    if (nickname.length < 2 || nickname.length > 11) {
      setError("닉네임은 2 ~ 11자 사이여야 합니다.");
      return;
    }

    if (nicknameAvailable === false) {
      setError("이미 사용 중인 닉네임입니다.");
      return;
    }

    // URL에 프로토콜이 없으면 추가
    let formattedBlog = blog;
    if (!/^https?:\/\//i.test(blog)) {
      formattedBlog = "http://" + blog;
    }

    // URL 유효성 검사
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,6})" + // domain name with minimum two letters TLD
        "(:\\d+)?(\\/[-a-z\\d%_.~+\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF@]*)*" + // port and path with Unicode and @
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i", // fragment locator
    );

    if (formattedBlog && !urlPattern.test(formattedBlog)) {
      setBlogError("유효한 URL을 입력하세요.");
      return;
    }

    setError("");
    setBlogError("");

    try {
      const { data, error: fetchError } = await supabase.from("Users").select("user_id").eq("user_id", user.id);

      if (fetchError) {
        console.error("Error fetching data:", fetchError);
        setError("Failed to fetch user data. Please try again.");
        return;
      }

      if (data && data.length > 0) {
        const { error: updateError } = await supabase
          .from("Users")
          .update({
            job_title,
            experience,
            nickname,
            blog: formattedBlog,
            email: user.email,
            profile_image_url,
          })
          .eq("user_id", user.id);

        if (updateError) {
          console.error("Error updating data:", updateError);
          setError("Failed to update profile. Please try again.");
          return;
        }

        setNickname(nickname);
        setBlog(formattedBlog);
      } else {
        const { data, error: insertError } = await supabase
          .from("Users")
          .insert({
            user_id: user.id,
            job_title,
            experience,
            nickname,
            blog: formattedBlog,
            email: user.email,
            profile_image_url,
          })
          .select();

        if (insertError) {
          console.error("Error inserting data:", insertError);
          setError("Failed to save profile. Please try again.");
          return;
        }
        setUserData(data[0]);
        setNickname(nickname);
        setBlog(formattedBlog);
      }

      nextStep();
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const handleNicknameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newNickname = e.target.value;
    setLocalNickname(newNickname);
    setError(null);

    if (newNickname.length >= 2 && newNickname.length <= 10) {
      checkNicknameAvailability(newNickname);
    } else {
      setNicknameAvailable(null);
    }
  };

  const handleBlogChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocalBlog(e.target.value);
    setBlogError(null);
  };

  useEffect(() => {
    if (nickname && blog) {
      setIsFormComplete(true);
    } else {
      setIsFormComplete(false);
    }
  }, [nickname, blog]);

  return (
    <div className="s:w-[370px] s:h-[550px] w-[430px] h-[610px] relative bg-background rounded-[20px] p-4 select-none">
      {prevStep && (
        <button onClick={prevStep} className="absolute left-9 top-10 text-[c4c4c4]">
          &larr;
        </button>
      )}
      <div className="absolute left-1/2 transform -translate-x-1/2 top-4 flex space-x-2">
        <div className="w-[136px] s:h-18 h-20 justify-start items-center gap-2 inline-flex">
          <div className="w-10 h-10 p-2.5 rounded-[11px] border border-[#28282a] flex-col justify-center items-center gap-2.5 inline-flex">
            <div className="self-stretch text-center text-[#5e5e5e] text-sm font-medium font-['Pretendard'] leading-[21px]">
              1
            </div>
          </div>
          <div className="w-10 h-10 p-2.5 rounded-[11px] border border-[#28282a] flex-col justify-center items-center gap-2.5 inline-flex">
            <div className="self-stretch text-center text-[#5e5e5e] text-sm font-medium font-['Pretendard'] leading-[21px]">
              2
            </div>
          </div>
          <div className="w-10 h-10 p-2.5 rounded-[11px] border border-[#c3e88d] flex-col justify-center items-center gap-2.5 inline-flex">
            <div className="self-stretch text-center text-[#c3e88d] text-sm font-medium font-['Pretendard'] leading-[21px]">
              3
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-2xl font-medium text-[#fffff] leading-9 mt-20">거의 다 왔어요!</div>
      <div className="text-center text-[#9a9a9a] s:mt-1 mt-3">
        자신을 나타낼 수 있는 포트폴리오 링크를 알려주시면 <br /> 함께 할 동료를 만나는 데 큰 도움이 될거예요.
      </div>

      <div className="s:mt-6 mt-8">
        <label className="block text-sm ml-5 font-medium text-[#bebec1]"> 닉네임 </label>
        <input
          type="text"
          placeholder="닉네임을 입력해주세요"
          value={nickname}
          onChange={handleNicknameChange}
          className="block s:w-[300px] w-[350px] s:mt-1 mt-3 ml-5 h-[50px] p-2 bg-background rounded-md border-2 border-fillLight"
        />
        <p className="text-xs text-gray-500 mt-2 ml-5">닉네임은 2 ~ 11자 내로 작성해주세요.</p>
        {nicknameAvailable === false && <p className="text-xs text-red-500 mt-1 ml-5">이미 사용 중인 닉네임입니다.</p>}
        {nicknameAvailable === true && <p className="text-xs text-green-500 mt-1 ml-5">사용 가능한 닉네임입니다.</p>}
        {error && <p className="text-xs text-red-500 s:mt-1 mt-1">{error}</p>}
      </div>

      <div className="s:mt-4 mt-8">
        <label className="block text-sm ml-5 font-medium text-[#bebec1]">URL </label>
        <input
          type="text"
          placeholder="URL을 입력해주세요"
          value={blog}
          onChange={handleBlogChange}
          className="block s:w-[300px] w-[350px] s:mt-1 mt-3 ml-5 h-[50px] p-2 bg-background rounded-md border-2 border-fillLight"
        />
        <p className="text-xs text-gray-500 ml-5 mt-2">Blog / Github / Notion / Tistory / Velog / Figma / Etc </p>
        {blogError && <p className="text-xs text-red-500 s:mt-1 mt-1 ml-5 ">{blogError}</p>}
      </div>

      <div className="absolute s:bottom-8 bottom-10 left-1/2 transform -translate-x-1/2 w-full px-4">
        <button
          onClick={handleNext}
          className={`s:w-[300px] w-[350px] h-[45px] ml-5 py-2 rounded-md transition-transform transform hover:scale-105 active:scale-95 active:bg-gray-800 active:text-gray-200 ${
            isFormComplete
              ? "bg-[#c3e88d] text-[#343437] hover:bg-[#c3e88d] hover:text-[#343437]"
              : "bg-[#343437] text-[#ffffff]"
          }`}
        >
          프로필 저장하기
        </button>
      </div>
    </div>
  );
};

export default Signup03;
