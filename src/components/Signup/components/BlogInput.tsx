import React, { useEffect } from "react";
import { UseFormRegister, UseFormWatch } from "react-hook-form";
import { FormValues } from "../Signup03";

interface BlogInputProps {
  register: UseFormRegister<FormValues>;
  watch: UseFormWatch<FormValues>;
  blogError: string | null;
  blogSuccess: string | null;
  setBlogError: (value: string | null) => void;
  setBlogSuccess: (value: string | null) => void;
  validateUrl: (url: string) => boolean;
}

const BlogInput: React.FC<BlogInputProps> = ({
  register,
  watch,
  blogError,
  blogSuccess,
  setBlogError,
  setBlogSuccess,
  validateUrl,
}) => {
  const blog = watch("blog");

  useEffect(() => {
    if (blog && blog.trim() !== "") {
      if (validateUrl(blog)) {
        setBlogError(null);
        setBlogSuccess("유효한 URL입니다.");
      } else {
        setBlogError("유효한 URL을 입력하세요.");
        setBlogSuccess(null);
      }
    } else {
      setBlogError(null);
      setBlogSuccess(null);
    }
  }, [blog, validateUrl, setBlogError, setBlogSuccess]);

  return (
    <div className="s:mt-4 mt-9">
      <label className="block text-sm ml-5 font-medium text-[#bebec1]">URL (선택사항)</label>
      <input
        type="text"
        placeholder="URL을 입력해주세요"
        {...register("blog")}
        className="block focus:outline-primaryHeavy s:w-[300px] w-[350px] s:mt-1 mt-3 ml-5 h-[50px] p-2 bg-background rounded-md border-2 border-fillLight"
      />
      <p className="text-xs text-gray-500 ml-5 mt-2">Blog / Github / Notion / Tistory / Velog / Figma / Etc</p>
      {blogError && <p className="text-xs text-red-500 s:mt-1 mt-1 ml-5">{blogError}</p>}
      {blogSuccess && <p className="text-xs text-green-500 s:mt-1 mt-1 ml-5">{blogSuccess}</p>}
    </div>
  );
};

export default BlogInput;
