// 1. 실제 데이터 카드
export const LpCard = ({ lp }: { lp: any }) => (
  <div className="group relative aspect-square bg-gray-800 rounded-lg overflow-hidden shadow-lg">
    <img src={lp.thumbnail} alt={lp.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
      <p className="font-bold truncate">{lp.title}</p>
      <p className="text-xs opacity-70">❤️ {lp.likes.length}</p>
    </div>
  </div>
);

// 2. 스켈레톤 카드 (이미지 요구사항: 카드와 동일 크기 + animate-pulse)
export const LpCardSkeleton = () => (
  <div className="aspect-square bg-gray-700 rounded-lg animate-pulse" />
);