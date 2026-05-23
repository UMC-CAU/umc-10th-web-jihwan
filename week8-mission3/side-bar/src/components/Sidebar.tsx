import { useEffect } from "react";

interface SidebarProps {
    isOpen:boolean;
    onClose: () => void;
}

// 사이드바 컴포넌트
export const Sidebar = ({isOpen, onClose}:SidebarProps) => {
    // ESC 키로 사이드바 닫기
    useEffect(() => { 
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => { // 컴포넌트 언마운트 시 이벤트 리스너 정리
            window.removeEventListener('keydown', handleEsc);
        }
    }, [isOpen, onClose]);

    useEffect(()=> {
        // 사이드바가 열릴 때 스크롤 방지
        if(isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return() =>{
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    return (
        // 오버레이
        <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm 
        transition-opacity duration-300 z-70 ${isOpen ? "opacity-100": 
            "opacity-0 pointer-events-none"}`} 
            onClick={onClose}
            >
                // 사이드바 컨테이너
                <aside 
                className={`fixed top-0 left-0 h-full w-80
                 bg-white shadow-2xltransform transition-transform duration-300 ease-in-out z-50
                 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
                 role="dialog"
                 >
                    <div className="flex flex-col h-full">
                        <div className = "p-6 border-b border-gray-200">
                            <h2 className ="text-2xl font-bold text-gray-900">메뉴</h2> 
                        </div>
                        <nav className="flex-1 overflow-y-auto p-4">
                        <ul className= "space-y-2">
                            <li> 
                                <a href="#search" className="flex items-center px-4 py-3 text-gray-700
                                hover:bg-gray-100 transition-colors">
                                    <span>🔍</span>
                                    <span className="ml-3">검색</span>

                                </a>
                            </li>
                            <li>
                                <a href="#mypage" 
                                className="flex items-center px-4 py-3 text-gray-700
                                hover:bg-gray-100 transition-colors">
                                    <span>🤖</span>
                                    <span className="ml-3">마이페이지</span>

                                </a>
                            </li>
                        </ul>
                    </nav>
                    
                    </div>

                    
                 </aside>
            </div>
    )

}