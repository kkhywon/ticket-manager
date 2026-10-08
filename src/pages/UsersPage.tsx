import { useState } from 'react'
import { getUsers, updateUser, deleteUser, } from '../services/userService'
import type { User } from '../types'

// 담당자 관리 화면
function UserPage() {
    // 담당자 목록과 수정 중인 입력값 관리
    const [users, setUsers] = useState(() => getUsers())
    const [editingId, setEditingId] = useState<number | null>(null)
    const [name, setName] = useState('')
    const [department, setDepartment] = useState('')
    const [error, setError] = useState('')
    const [deleteError, setDeleteError] = useState('')

    // 선택한 담당자 정보를 입력란에 채우기
    function handleEdit(user: User) {
        setEditingId(user.id)
        setName(user.name)
        setDepartment(user. department ?? '')
        setError('')
    }

    // 수정 입력을 닫고 초기화
    function handleCancel() {
        setEditingId(null)
        setName('')
        setDepartment('')
        setError('')
    }

    // 변경 내용을 저장하고 화면 목록 갱신
    function handleSave() {
        if (editingId === null) {
            return
        }

        try {
            updateUser(editingId, name, department)
            setUsers(getUsers())
            handleCancel()
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : '담당자를 수정하지 못했습니다.'
            )
        }
    }

    // 삭제 확인 후 담당자 목록 갱신
    function handleDelete(user: User) {
        setDeleteError('')

        const confirmed = window.confirm(
            `${user.name} 담당자를 삭제할까요?\n기존 담당 티켓은 미배정으로 표시됩니다.`
        )

        if (!confirmed) {
            return
        }

        try {
            deleteUser(user.id)
            setUsers(getUsers())

            if (editingId === user.id) {
                handleCancel()
            }
        } catch (error) {
            setDeleteError(
                error instanceof Error
                ? error.message
                : '담당자를 삭제하지 못했습니다.'
            )
        }
    }

    return (
        <section className="space-y-6">
            <header>
                <h1 className="text-2xl font-medium tracking-tight md:text-3xl">
                    담당자 관리
                </h1>
                <p className="mt-2 text-sm text-[#526D82]">
                    등록된 담당자와 부서를 확인하세요.
                </p>
            </header>

            <div className="glass-panel p-5 md:p-6">
                <h2 className="mb-4 text-sm font-medium">
                    담당자 {users.length}명
                </h2>

                {deleteError && (
                    <p role="alert" className="mb-4 text-sm text-red-800">
                        {deleteError}
                    </p>
                )}

                {users.length === 0 ? (
                    <p className="py-8 text-center text-sm text-[#526D82]">
                        등록된 담당자가 없습니다.
                    </p>
                ) : (
                    <ul className="divide-y divide-[#14324B]/10">
                        {users.map((user) => (
                            <li key={user.id} className="py-4">
                                {editingId === user.id ? (
                                    <form
                                    onSubmit={(event) => {
                                        event.preventDefault()
                                        handleSave()
                                    }}
                                    className="space-y-3"
                                    >
                                    <label className="block text-sm text-[#425D73]">
                                        이름
                                        <input
                                        type="text"
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                        className="mt-2 w-full rounded-lg border border-[#14324B]/15 bg-white/30 px-3 py-2"
                                        />
                                    </label>

                                    <label className="block text-sm text-[#425D73]">
                                        부서
                                        <input
                                        type="text"
                                        value={department}
                                        onChange={(event) => setDepartment(event.target.value)}
                                        className="mt-2 w-full rounded-lg border border-[#14324B]/15 bg-white/30 px-3 py-2"
                                        />
                                    </label>

                                    {error && (
                                        <p role="alert" className="text-sm text-red-800">
                                        {error}
                                        </p>
                                    )}

                                    <div className="flex justify-end gap-2">
                                        <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="rounded-lg px-4 py-2 text-sm text-[#526D82]"
                                        >
                                        취소
                                        </button>

                                        <button type="submit" className="glass-create-button">
                                        수정 저장
                                        </button>
                                    </div>
                                    </form>
                                ) : (
                                    <div className="flex items-center justify-between gap-4">
                                    <div className="min-w-0">
                                        <p className="break-words font-medium">
                                        {user.name}
                                        </p>
                                        <p className="mt-1 break-words text-sm text-[#526D82]">
                                        {user.department || '부서 미설정'}
                                        </p>
                                    </div>

      <div className="flex shrink-0 flex-wrap gap-2">
        <button
            type="button"
            onClick={() => handleEdit(user)}
            className="glass-create-button"
        >
            수정
        </button>

        <button
            type="button"
            onClick={() => handleDelete(user)}
            className="rounded-lg border border-red-800/20 bg-white/25 px-4 py-2 text-sm text-red-800 transition-colors hover:bg-red-50/60"
        >
            삭제
        </button>
        </div>
    </div>
  )}
</li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    )
}

export default UserPage