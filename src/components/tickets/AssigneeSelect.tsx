import { useState } from 'react'
import { createUser, getUsers } from '../../services/userService'

interface AssigneeSelectProps {
  value: string
  onChange: (value: string) => void
  inputClassName: string
}

function AssigneeSelect({
  value,
  onChange,
  inputClassName,
}: AssigneeSelectProps) {
  const [users, setUsers] = useState(getUsers)
  const [isAdding, setIsAdding] = useState(false)
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  // 담당자 추가 후 선택 목록과 선택값 갱신
  function handleAdd() {
    setError('')

    try {
      const newUser = createUser(name)

      setUsers(getUsers())
      onChange(String(newUser.id))
      setName('')
      setIsAdding(false)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : '담당자를 추가하지 못했습니다.'
      )
    }
  }

  // 추가 입력 취소
  function handleCancel() {
    setIsAdding(false)
    setName('')
    setError('')
  }

  return (
    <div className="min-w-0">
      {/* 담당자 선택 */}
      <label className="block text-sm font-medium text-[#425D73]">
        담당자
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={inputClassName}
        >
          <option value="">미배정</option>

          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} 
            </option>
          ))}
        </select>
      </label>

      {/* 담당자 추가 입력 */}
      {isAdding ? (
        <div className="mt-3 rounded-xl border border-white/70 bg-white/25 p-3">
          <label className="block text-sm text-[#425D73]">
            새 담당자 이름
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              onKeyDown={(event) => {
                if (
                  event.key === 'Enter' &&
                  !event.nativeEvent.isComposing
                ) {
                  event.preventDefault()
                  handleAdd()
                }
              }}
              placeholder="이름을 입력하세요"
              className={inputClassName}
            />
          </label>

          {error && (
            <p role="alert" className="mt-2 text-xs text-red-800">
              {error}
            </p>
          )}

          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg px-3 py-2 text-sm text-[#526D82] hover:bg-white/30"
            >
              취소
            </button>

            <button
              type="button"
              onClick={handleAdd}
              className="glass-create-button"
            >
              추가
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="mt-2 rounded-lg px-2 py-2 text-xs font-medium text-[#205B91] hover:bg-white/30"
        >
          + 담당자 추가
        </button>
      )}
    </div>
  )
}

export default AssigneeSelect