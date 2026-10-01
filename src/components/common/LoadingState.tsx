// 데이터를 불러오는 동안 표시
function LoadingState() {
  return (
    <section className="glass-panel px-6 py-16 text-center">
      <p role="status" className="text-sm text-[#526D82]">
        티켓을 불러오는 중입니다…
      </p>
    </section>
  )
}

export default LoadingState