"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@/provider/UserContextProvider";
import { fetchPosts } from "@/lib/fetchPosts";
import PostCardShort from "@/components/Common/Card/PostCard/PostCardShort";
import MypageList from "@/components/Common/Skeleton/MypageList";
import Pagination from "@/components/MyPage/Common/Pagination";

type Tab = "전체" | "스터디" | "프로젝트";

const PostsTap: React.FC = () => {
  const { user } = useUser();
  const [selectedTab, setSelectedTab] = useState<Tab>("전체");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const loadPosts = async () => {
      if (user && user.id) {
        setLoading(true);
        try {
          // 최신순 정렬 및 카테고리 필터링 적용
          const userPosts = await fetchPosts(
            1,
            selectedTab !== "전체" ? selectedTab : undefined,
            { user_id: user.id },
            { order: { column: "created_at", ascending: false } },
          );
          setPosts(userPosts);
          setTotalPages(Math.ceil(userPosts.length / 9));
        } catch (error) {
          console.error("포스트 불러오는 중 오류 발생:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadPosts();
  }, [user, selectedTab]);

  const handleTabClick = (tab: Tab) => {
    setSelectedTab(tab);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * 9;
  const currentPosts = posts.slice(startIndex, startIndex + 9);

  return (
    <div className="flex-1 flex flex-col">
      <div className="sticky z-10 s:relative s:top-auto">
        <div className="flex space-x-4 sm:space-x-2">
          <button
            className={`text-baseS min-w-[64px] ${selectedTab === "전체" ? "tab-button" : ""}`}
            onClick={() => handleTabClick("전체")}
          >
            전체
          </button>
          <button
            className={`text-baseS min-w-[64px] ${selectedTab === "스터디" ? "tab-button" : ""}`}
            onClick={() => handleTabClick("스터디")}
          >
            스터디
          </button>
          <button
            className={`text-baseS min-w-[64px] ${selectedTab === "프로젝트" ? "tab-button" : ""}`}
            onClick={() => handleTabClick("프로젝트")}
          >
            프로젝트
          </button>
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex-1 s:w-full mt-5 grid s:grid-cols-1 m:grid-cols-2 grid-cols-3 gap-6">
          {loading ? (
            Array(3)
              .fill(0)
              .map((_, index) => <MypageList key={index} />)
          ) : posts.length > 0 ? (
            currentPosts.map((post) => (
              <div key={post.post_id} className="s:w-full">
                <PostCardShort post={post} />
              </div>
            ))
          ) : (
            <p className="mt-5 text-center text-labelNeutral col-span-full">작성된 글이 없어요. 🥺</p>
          )}
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
};

export default PostsTap;
