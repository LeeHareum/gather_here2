"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, FC } from "react";
import Modal from "react-modal";
import CommonModal from "@/components/Common/Modal/CommonModal";

interface ModalContextType {
  openModal: (content: ReactNode, disablePage?: boolean) => void;
  closeModal: () => void;
}

interface ContextProviderProps {
  children: ReactNode;
}

// 모달을 열고 닫는 함수의 Context 생성
const ModalContext = createContext<ModalContextType>({
  openModal: () => {},
  closeModal: () => {},
});

// useModal 훅을 사용하여 ModalContext를 사용할 수 있게 내보냄
export const useModal = () => useContext(ModalContext);

const ContextProvider: FC<ContextProviderProps> = ({ children }) => {
  const [modalContent, setModalContent] = useState<ReactNode>(null); // 모달 안에 들어갈 내용을 저장
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달이 열려있는지 여부를 저장
  const [disablePage, setDisablePage] = useState(false); // 페이지 비활성화 여부를 저장

  useEffect(() => {
    Modal.setAppElement("body"); // Next.js 루트 요소를 설정
  }, []);

  const openModal = (content: ReactNode, disable: boolean = false) => {
    setModalContent(content); // 모달 내용을 설정
    setIsModalOpen(true); // 모달 열기
    setDisablePage(disable); // 페이지 비활성화 설정
  };

  const closeModal = () => {
    setIsModalOpen(false); // 모달 닫기
    setModalContent(null); // 모달 내용 초기화
    setDisablePage(false); // 페이지 비활성화 해제
  };

  useEffect(() => {
    if (disablePage) {
      document.body.classList.add('page-disabled');
    } else {
      document.body.classList.remove('page-disabled');
    }
    return () => {
      document.body.classList.remove('page-disabled');
    };
  }, [disablePage]);

  return (
    // ModalContext.Provider로 모달을 열고 닫는 함수를 제공
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {isModalOpen && (
        <>
          {disablePage && <div className="modal-background" onClick={closeModal} />}
          <div className="modal-content">
            {modalContent}
          </div>
        </>
      )}
    </ModalContext.Provider>
  );
};

export default ContextProvider;