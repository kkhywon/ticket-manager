interface EmptyStateProps {
  title: string
  description: string
}

// 데이터 또는 검색 결과가 없을 때 표시
function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="px-6 py-16 text-center">
      <p className="font-medium">{title}</p>
      <p className="mt-2 text-sm text-[#526D82]">
        {description}
      </p>
    </div>
  )
}

export default EmptyState