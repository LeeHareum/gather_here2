"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import DOMPurify from "dompurify";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
import "react-quill/dist/quill.core.css";
import LikeButton from "@/components/MainDetail/LikeButton";
import ShareButton from "@/components/MainDetail/ShareButton";

const supabase = createClient();

const MainDetailPage = () => {
  const pathname = usePathname();
  const router = useRouter();
  const id = pathname.split("/").pop() as string;
  const [post, setPost] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPostAndUser = async () => {
      if (id) {
        const { data: postData, error: postError } = await supabase
          .from("Posts")
          .select("*")
          .eq("post_id", id)
          .single();

        if (postError) {
          console.error("Error fetching post:", postError);
          setLoading(false);
          return;
        }

        setPost(postData);

        const { data: userData, error: userError } = await supabase
          .from("Users")
          .select("profile_image_url, nickname, job_title, experience")
          .eq("user_id", postData.user_id)
          .single();

        if (userError) {
          console.error("Error fetching user:", userError);
        } else {
          setUser(userData);
        }

        const { data: currentUserData, error: currentUserError } = await supabase.auth.getUser();
        if (currentUserError) {
          console.error("Error fetching current user:", currentUserError);
        } else {
          setCurrentUser(currentUserData?.user);
        }

        setLoading(false);
      }
    };

    fetchPostAndUser();
  }, [id]);

  const handleDelete = async () => {
    if (!currentUser || currentUser.id !== post.user_id) {
      toast.error("본인의 글만 삭제할 수 있습니다");
      return;
    }

    const { error } = await supabase.from("Posts").delete().eq("post_id", id);
    if (error) {
      toast.error("게시물 삭제에 실패했습니다.");
    } else {
      toast.success("게시물이 삭제되었습니다.");
      router.push("/");
      router.refresh();
    }
  };

  const confirmDelete = () => {
    toast(
      <div className="bg-fillAlternative p-4 ml-6 rounded-lg shadow-md text-fontWhite flex flex-col items-center">
        <p className="text-xl font-semibold mb-2">정말 삭제하시겠어요?</p>
        <p className="text-sm text-labelNeutral mb-4 text-center">삭제하면 다시 복구할 수 없어요.</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => toast.dismiss()}
            className="bg-fillLight hover:bg-fillNormal text-primary font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            취소할래요
          </button>
          <button
            onClick={() => {
              handleDelete();
              toast.dismiss();
            }}
            className="bg-primaryStrong hover:bg-primary text-labelAssistive font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            삭제할래요
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
      },
    );
  };

  const handleMoreOptions = () => {
    setShowOptions(!showOptions);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [optionsRef]);

  const timeAgo = (timestamp: string): string => {
    const now: Date = new Date();
    const postDate: Date = new Date(timestamp);
    const diff = now.getTime() - postDate.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    return `${days}일 전`;
  };

  if (!post) return <></>;

  const cleanContent = DOMPurify.sanitize(post.content, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "h1", "h2", "h3", "p", "span", "ul", "ol", "li"],
    ALLOWED_ATTR: ["href", "target", "style", "class"],
  });

  const renderTechStackIcons = (techStack: string[]) => {
    return techStack.map((tech) => (
      <Image key={tech} src={`/Stacks/${tech}.png`} alt={tech} width={24} height={24} className="inline-block mr-2" />
    ));
  };

  return (
    <>
      <div className="w-full mx-auto max-w-container-l m:max-w-container-m s:max-w-container-s bg-background text-fontWhite rounded-lg shadow-md">
        <button onClick={() => router.back()} className="text-labelNeutral mt-5 mb-4 flex items-center space-x-2">
          <Image src="/Common/Icons/back.png" alt="Back" width={16} height={16} />
          <span>목록으로 돌아갈게요</span>
        </button>
      </div>
      <div className="w-full mx-auto max-w-container-l m:max-w-container-m s:max-w-container-s p-4 bg-fillAlternative text-fontWhite rounded-lg shadow-md">
        <ToastContainer
          toastClassName={() =>
            "relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer bg-fillAlternative"
          }
          bodyClassName={() => "text-sm font-white font-med block p-3"}
          position="top-center"
          autoClose={5000}
          hideProgressBar
          closeOnClick
          pauseOnHover
        />
        <div className="mb-4 p-3">
          <h1 className="text-title font-title">{post.title}</h1>
        </div>
        <div className="flex items-center justify-between mb-4 pl-3 pr-3">
          <div className="flex items-center space-x-2">
            {user?.profile_image_url && (
              <Image
                src={user.profile_image_url ?? "/assets/header/user.svg"}
                alt={user.nickname}
                width={28}
                height={28}
                className="rounded-full"
              />
            )}
            <span className="text-base font-medium">{user?.nickname}</span>
            <span className="text-sm text-labelNeutral">{timeAgo(post.created_at)}</span>
          </div>
          <div className="flex items-center space-x-4">
            <ShareButton />
            <LikeButton postId={id} currentUser={currentUser} category={post.category} />
            {currentUser?.id === post.user_id && (
              <div className="relative" ref={optionsRef}>
                <button onClick={handleMoreOptions} className="flex items-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 4 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-1"
                  >
                    <path
                      d="M2 17C2.26522 17 2.51957 16.8946 2.70711 16.7071C2.89464 16.5196 3 16.2652 3 16C3 15.7348 2.89464 15.4804 2.70711 15.2929C2.51957 15.1054 2.26522 15 2 15C1.73478 15 1.48043 15.1054 1.29289 15.2929C1.10536 15.4804 1 15.7348 1 16C1 16.2652 1.10536 16.5196 1.29289 16.7071C1.48043 16.8946 1.73478 17 2 17ZM2 10C2.26522 10 2.51957 9.89464 2.70711 9.70711C2.89464 9.51957 3 9.26522 3 9C3 8.73478 2.89464 8.48043 2.70711 8.29289C2.51957 8.10536 2.26522 8 2 8C1.73478 8 1.48043 8.10536 1.29289 8.29289C1.10536 8.48043 1 8.73478 1 9C1 9.26522 1.10536 9.51957 1.29289 9.70711C1.48043 9.89464 1.73478 10 2 10ZM2 3C2.26522 3 2.51957 2.89464 2.70711 2.70711C2.89464 2.51957 3 2.26522 3 2C3 1.73478 2.89464 1.48043 2.70711 1.29289C2.51957 1.10536 2.26522 1 2 1C1.73478 1 1.48043 1.10536 1.29289 1.29289C1.10536 1.48043 1 1.73478 1 2C1 2.26522 1.10536 2.51957 1.29289 2.70711C1.48043 2.89464 1.73478 3 2 3Z"
                      stroke="#5E5E5E"
                      strokeWidth="2"
                    />
                  </svg>
                </button>
                {showOptions && (
                  <div className="absolute right-0 mt-2 w-48 bg-fillStrong rounded-lg shadow-lg py-2">
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-fillAssistive flex items-center"
                      onClick={() => router.push(`/post/${id}`)}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-2"
                      >
                        <path
                          d="M9.16616 10.4135L9.16604 10.4136C6.79968 12.786 5.00766 15.6684 3.92724 18.8402C3.86842 19.0115 3.85906 19.196 3.90024 19.3724C3.94142 19.5489 4.0315 19.7102 4.16015 19.8378L4.1624 19.84C4.16246 19.8401 4.16251 19.8402 4.16256 19.8402C4.25205 19.9303 4.35848 20.0019 4.47571 20.0508C4.59301 20.0997 4.71883 20.1249 4.84592 20.125H4.84609C4.95285 20.1249 5.05887 20.1073 5.15993 20.0729L5.11963 19.9546L5.15994 20.0729C8.3318 18.9925 11.2143 17.2005 13.5866 14.834L13.5867 14.8339L19.2096 9.21091C19.7958 8.62473 20.1251 7.8297 20.1251 7.00071C20.1251 6.17172 19.7958 5.37669 19.2096 4.7905C18.9194 4.50026 18.5748 4.27002 18.1956 4.11293C17.8164 3.95585 17.4099 3.875 16.9994 3.875C16.1705 3.875 15.3754 4.20431 14.7892 4.79049L9.16616 10.4135ZM18.2686 8.26967L18.2685 8.2698L16.8478 9.69045L14.3097 7.15229L15.7303 5.7316L15.7305 5.73147C15.897 5.56441 16.0949 5.43183 16.3128 5.34132C16.5306 5.2508 16.7642 5.20412 17.0001 5.20395C17.236 5.20378 17.4697 5.25012 17.6876 5.34033C17.9056 5.43053 18.1037 5.56282 18.2705 5.72964C18.4373 5.89645 18.5696 6.09452 18.6598 6.31251C18.75 6.5305 18.7963 6.76413 18.7962 7.00004C18.796 7.23595 18.7493 7.46952 18.6588 7.68737C18.5683 7.90523 18.4357 8.1031 18.2686 8.26967ZM12.6456 13.8927C10.5978 15.9352 8.1441 17.5235 5.44446 18.5557C6.47662 15.856 8.06493 13.4024 10.1074 11.3545L13.3685 8.0934L15.9067 10.6316L12.6456 13.8927Z"
                          fill="#919191"
                          stroke="#919191"
                          strokeWidth="0.25"
                        />
                      </svg>
                      수정하기
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-fillAssistive flex items-center"
                      onClick={confirmDelete}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-2"
                      >
                        <path
                          d="M8 5.6C8 5.17565 8.16857 4.76869 8.46863 4.46863C8.76869 4.16857 9.17565 4 9.6 4H14.4C14.8243 4 15.2313 4.16857 15.5314 4.46863C15.8314 4.76869 16 5.17565 16 5.6V7.2H19.2C19.4122 7.2 19.6157 7.28429 19.7657 7.43431C19.9157 7.58434 20 7.78783 20 8C20 8.21217 19.9157 8.41566 19.7657 8.56569C19.6157 8.71571 19.4122 8.8 19.2 8.8H18.3448L17.6512 18.5136C17.6225 18.9173 17.4418 19.2951 17.1457 19.5709C16.8495 19.8467 16.4599 20 16.0552 20H7.944C7.53931 20 7.14965 19.8467 6.85351 19.5709C6.55736 19.2951 6.37673 18.9173 6.348 18.5136L5.656 8.8H4.8C4.58783 8.8 4.38434 8.71571 4.23431 8.56569C4.08429 8.41566 4 8.21217 4 8C4 7.78783 4.08429 7.58434 4.23431 7.43431C4.38434 7.28429 4.58783 7.2 4.8 7.2H8V5.6ZM9.6 7.2H14.4V5.6H9.6V7.2ZM7.2592 8.8L7.9448 18.4H16.056L16.7416 8.8H7.2592Z"
                          fill="#919191"
                        />
                      </svg>
                      삭제하기
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <hr className="border-fillNeutral mb-4" />
        <div>
          <h2 className="text-lg text-labelAssistive font-semibold mb-2">모집 정보</h2>
        </div>
        <div className="flex mb-4 flex-wrap">
          <div className="w-1/2 p-4">
            <p className="mb-3">
              <strong className="text-labelNeutral">분류</strong> <span className="ml-5">{post.category}</span>
            </p>
            <p className="mb-3">
              <strong className="text-labelNeutral">지역</strong> <span className="ml-5">{post.location}</span>
            </p>
            <p className="mb-3">
              <strong className="text-labelNeutral">기간</strong> <span className="ml-5">{post.duration}개월</span>
            </p>
            <p className="mb-3">
              <strong className="text-labelNeutral">총 인원</strong>{" "}
              <span className="ml-5">{post.total_members}명</span>
            </p>
            <p className="mb-3">
              <strong className="text-labelNeutral">지원 방법</strong>{" "}
              <span className="ml-5">{post.personal_link}</span>
            </p>
          </div>
          <div className="w-1/2 p-3">
            <p className="mb-3">
              <strong className="text-labelNeutral">모집 대상</strong>{" "}
              <span className="ml-5">{post.target_position.join(", ")}</span>
            </p>
            <p className="mb-3">
              <strong className="text-labelNeutral">모집 인원</strong>{" "}
              <span className="ml-5">{post.recruitments}명</span>
            </p>
            <p className="mb-3">
              <strong className="text-labelNeutral">기술 스택</strong>
              <span className="ml-5">{renderTechStackIcons(post.tech_stack)}</span>
            </p>
            <p className="mb-3">
              <strong className="text-labelNeutral">마감일</strong>{" "}
              <span className="ml-5">{new Date(post.deadline).toLocaleDateString()}</span>
            </p>
            <p className="mb-3">
              <strong className="text-labelNeutral">장소</strong> <span className="ml-5">{post.place}</span>
            </p>
          </div>
        </div>
        <hr className="border-fillNeutral mb-4" />
        <div>
          <h2 className="text-lg text-labelAssistive font-semibold mb-5">모집 내용</h2>
        </div>
        <div className="bg-fillLight p-4 rounded-lg shadow-md">
          <div className="ql-editor" dangerouslySetInnerHTML={{ __html: cleanContent }} />
        </div>
      </div>
    </>
  );
};

export default MainDetailPage;
