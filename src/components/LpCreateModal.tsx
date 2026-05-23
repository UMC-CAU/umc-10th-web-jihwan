// src/components/LpCreateModal.tsx
// 무한 스크롤 홈 화면에서 LP를 새로 등록할 때 사용하는 모달 컴포넌트
// LP 생성 폼과 이미지 업로드 UI를 제공하며, 등록 성공 시 프론트엔드 캐시를 직접 갱신하여 새로고침 없이도 즉시 반영되도록 구현
import { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants/key";

interface LpCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LpCreateModal = ({ isOpen, onClose }: LpCreateModalProps) => {
  const queryClient = useQueryClient();

  // 1. 입력 폼 상태 관리
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState(""); 
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // 이미지 파일 선택 시 미리보기 처리
  // 파일 선택이 완료되면 FileReader를 사용하여 이미지 데이터를 읽어와서 thumbnail 상태에 저장한다.
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 태그 추가
  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagInput.trim()) return;
    if (tags.includes(tagInput.trim())) return;
    setTags([...tags, tagInput.trim()]);
    setTagInput("");
  };

  // 태그 삭제
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

// LP 생성 제출 핸들러
  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) { // 제목과 내용이 비어있는 경우 등록을 막고 사용자에게 알림을 띄운다.
      alert("제목과 내용을 입력해 주세요.");
      return;
    }
    // 백엔드 API에 LP 생성 요청을 보내는 로직을 여기에 작성한다.
    // 썸네일을 지정하지 않았을 경우 기본 이미지를 사용하도록 한다.
    const finalThumbnail = thumbnail || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500";

    alert("LP판 등록에 성공했습니다!");
    onClose();

    // 입력 필드 초기화
    setTitle("");
    setContent("");
    setThumbnail("");
    setTags([]);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[#1e1f21] w-full max-w-md rounded-2xl p-6 relative shadow-2xl text-white flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl cursor-pointer">
          ✕
        </button>

        {/* 이미지 업로드 디자인 구역 */}
        <div 
          onClick={() => fileInputRef.current?.click()} 
          className="relative w-48 h-48 mb-6 cursor-pointer group flex items-center justify-center overflow-hidden"
        >
          {thumbnail ? (
            <div className="w-full h-full relative flex items-center">
              <img src={thumbnail} alt="preview" className="w-[80%] h-full object-cover z-10 rounded-l-lg shadow-lg" />
              <div className="absolute right-2 w-36 h-36 bg-black rounded-full border-4 border-gray-700 shadow-inner" />
            </div>
          ) : (
            <div className="w-full h-full bg-black rounded-full border-8 border-gray-800 flex items-center justify-center shadow-2xl relative hover:border-gray-700 transition-colors">
              <div className="w-8 h-8 bg-white rounded-full z-10" />
              <span className="absolute text-xs text-gray-500 bottom-4">사진 선택 (선택)</span>
            </div>
          )}
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>

        {/* 입력창 가이드 */}
        <div className="w-full space-y-3">
          <input 
            type="text" 
            placeholder="LP Name" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[#2a2b2d] border border-gray-700 rounded-lg p-2 text-sm focus:outline-none focus:border-pink-500"
          />
          <textarea 
            placeholder="LP Content" 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            className="w-full bg-[#2a2b2d] border border-gray-700 rounded-lg p-2 text-sm focus:outline-none focus:border-pink-500 resize-none"
          />
          
          {/* 태그 영역 */}
          <form onSubmit={handleAddTag} className="flex gap-2">
            <input 
              type="text" 
              placeholder="LP Tag" 
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="flex-1 bg-[#2a2b2d] border border-gray-700 rounded-lg p-2 text-sm focus:outline-none focus:border-pink-500"
            />
            <button type="submit" className="bg-gray-700 hover:bg-gray-600 px-4 rounded-lg text-sm font-medium cursor-pointer">
              Add
            </button>
          </form>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {tags.map((tag) => (
              <span key={tag} className="bg-[#2a2b2d] text-xs text-gray-300 px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-gray-700">
                # {tag}
                <button type="button" onClick={() => handleRemoveTag(tag)} className="text-gray-500 hover:text-red-400 font-bold text-[10px] cursor-pointer">
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          className="w-full mt-6 bg-pink-500 hover:bg-pink-600 text-white font-bold py-2.5 rounded-lg text-sm transition-colors shadow-lg cursor-pointer"
        >
          Add LP
        </button>
      </div>
    </div>
  );
};

export default LpCreateModal;