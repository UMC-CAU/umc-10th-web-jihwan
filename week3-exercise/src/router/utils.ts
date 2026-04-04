// 1. 주소창만 바꾸는 함수
export const navigateTo = (to: string) => {
  window.history.pushState({}, '', to);
  // 커스텀 이벤트를 발생시켜서 Routes가 감지하게 만듭니다.
  const navigationEvent = new PopStateEvent('popstate');
  window.dispatchEvent(navigationEvent);
};

// 2. 현재 경로 가져오기 함수
export const getCurrentPath = () => window.location.pathname;