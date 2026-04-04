// 로딩 스피너 컴포넌트
export const LoadingSpinner = () =>{
    return (
        <div className='size-12 animate-spin rounded-full border-black-600
        border-6 border-t-transparent border-[#b2dab1'
        role='status'
        >
        <span className='sr-only'>Loading...</span>
        </div>
    )
}