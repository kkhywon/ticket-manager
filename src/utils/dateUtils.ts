// 날짜 문자열을 한국 날짜 형식으로 변환
export function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('ko-KR')
}