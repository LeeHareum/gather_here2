"use client";
import React from "react";

interface FilterBarProps {
  selectedPosition: string;
  selectedPlace: string;
  selectedLocation: string;
  selectedDuration: number | null;
  onChange: (
    selectedPosition: string,
    selectedPlace: string,
    selectedLocation: string,
    selectedDuration: number | null,
  ) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  selectedPosition,
  selectedPlace,
  selectedLocation,
  selectedDuration,
  onChange,
}) => {
  const handlePositionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value, selectedPlace, selectedLocation, selectedDuration);
  };

  const handlePlaceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(selectedPosition, event.target.value, selectedLocation, selectedDuration);
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(selectedPosition, selectedPlace, event.target.value, selectedDuration);
  };

  const handleDurationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const duration = event.target.value === "" ? null : parseInt(event.target.value, 10);
    onChange(selectedPosition, selectedPlace, selectedLocation, duration);
  };

  return (
    <div className="flex justify-between items-center mt-1 mb-5">
      <div className="grid grid-cols-1 gap-2 w-full s:grid-cols-2 md:grid-cols-4 md:gap-3">
        <select
          className={`shared-select-gray-2 ${
            selectedPosition ? "shared-select" : "shared-select-gray-2"
          } cursor-pointer`}
          value={selectedPosition}
          onChange={handlePositionChange}
          style={{ height: "40px", minHeight: "40px", lineHeight: "15px", padding: "0 1rem" }}
        >
          <option value="">직군</option>
          <option value="프론트엔드">프론트엔드</option>
          <option value="백엔드">백엔드</option>
          <option value="디자이너">디자이너</option>
          <option value="IOS">IOS</option>
          <option value="안드로이드">안드로이드</option>
          <option value="데브옵스">데브옵스</option>
          <option value="PM">PM</option>
          <option value="기획자">기획자</option>
          <option value="마케터">마케터</option>
        </select>
        <select
          className={`shared-select-gray-2 ${selectedPlace ? "shared-select" : "shared-select-gray-2"} cursor-pointer`}
          value={selectedPlace}
          onChange={handlePlaceChange}
          style={{ height: "40px", minHeight: "40px", lineHeight: "15px", padding: "0 1rem" }}
        >
          <option value="">방식</option>
          <option value="온/오프라인">온/오프라인</option>
          <option value="온라인">온라인</option>
          <option value="오프라인">오프라인</option>
        </select>
        <select
          className={`shared-select-gray-2 ${
            selectedLocation ? "shared-select" : "shared-select-gray-2"
          } cursor-pointer`}
          value={selectedLocation}
          onChange={handleLocationChange}
          style={{ height: "40px", minHeight: "40px", lineHeight: "15px", padding: "0 1rem" }}
        >
          <option value="">지역</option>
          <option value="서울">서울</option>
          <option value="인천">인천</option>
          <option value="대전">대전</option>
          <option value="광주">광주</option>
          <option value="대구">대구</option>
          <option value="부산">부산</option>
          <option value="울산">울산</option>
          <option value="제주">제주</option>
        </select>
        <select
          className={`shared-select-gray-2 ${
            selectedDuration ? "shared-select" : "shared-select-gray-2"
          } cursor-pointer`}
          value={selectedDuration !== null ? selectedDuration.toString() : ""}
          onChange={handleDurationChange}
          style={{ height: "40px", minHeight: "40px", lineHeight: "15px", padding: "0 1rem" }}
        >
          <option value="">기간</option>
          <option value="1">1개월</option>
          <option value="2">2개월</option>
          <option value="3">3개월</option>
          <option value="6">6개월</option>
          <option value="7">6개월 이상</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
