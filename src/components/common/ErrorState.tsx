interface ErrorStateProps {
  message: string
  onRetry: () => void
}

// 오류 안내와 재시도 버튼
function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <section className="glass-panel px-6 py-16 text-center">
      <p role="alert" className="font-medium text-[#14324B]">
        {message}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-lg bg-[#24485A] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#193A4B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#476C80]"
      >
        다시 시도
      </button>
    </section>
  )
}

export default ErrorState