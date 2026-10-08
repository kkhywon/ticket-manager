import type { User } from '../types'
import { USERS } from '../mocks/users'

const STORAGE_KEY = 'ticket-manager-users'

// 저장된 담당자를 읽고, 없으면 초기 담당자 사용
function loadUsers(): User[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (saved === null) {
      return [...USERS]
    }

    const parsed: unknown = JSON.parse(saved)

    if (
      !Array.isArray(parsed) ||
      !parsed.every(
        (user) =>
          typeof user === 'object' &&
          user !== null &&
          Number.isSafeInteger(user.id) &&
          user.id > 0 &&
          typeof user.name === 'string' &&
          user.name.trim().length > 0
      )
    ) {
      throw new Error('담당자 데이터 형식이 올바르지 않습니다.')
    }

    return parsed as User[]
  } catch (error) {
    console.error('담당자 목록을 읽지 못했습니다.', error)
    return [...USERS]
  }
}

let users: User[] = loadUsers()

// 삭제되지 않은 담당자만 조회
export function getUsers(): User[] {
  return users.filter((user => !user.isDeleted))
}

// 이름과 부서를 받아 새 담당자 저장
export function createUser(
    name: string,
    department: string = ''
  ): User {
  const trimmedName = name.trim()

  if (!trimmedName) {
    throw new Error('담당자 이름을 입력해주세요.')
  }

  const newUser: User = {
    id: Math.max(0, ...users.map((user) => user.id)) + 1,
    name: trimmedName,
    department: department.trim(),
  }

  const nextUsers = [...users, newUser]

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUsers))
  } catch {
    throw new Error('담당자를 저장하지 못했습니다. 다시 시도해주세요.')
  }

  users = nextUsers

  return newUser
}

// 담당자 번호로 찾아 이름과 부서 수정
export function updateUser(
  id: number,
  name: string,
  department: string
) : User {
  const trimmedName = name. trim()

  if(!trimmedName) {
    throw new Error('담당자 이름을 입력해주세요.')
  }

  const existingUser = users.find(
    (user) => user.id === id && !user.isDeleted
  )

  if (!existingUser){
    throw new Error('담당자를 찾을 수 없습니다.')
  }

  const updateUser: User = {
    ...existingUser,
    name: trimmedName,
    department: department.trim(),
  }

  const nextUsers = users.map((user) =>
    user.id === id ? updateUser : user
  )

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUsers))
  } catch {
    throw new Error('담당자를 수정하지 못했습니다. 다시 시도해주세요.')
  }

  users = nextUsers

  return updateUser
}

// 담당자를 삭제 상태로 저장
export function deleteUser(id: number): void {
  const existingUser = users.find(
    (user) => user.id === id && !user.isDeleted
  )

  if (!existingUser) {
    throw new Error('담당자를 찾을 수 없습니다.')
  }

  const nextUsers = users.map((user) =>
    user.id === id
    ? { ...user, isdeleted: true }
    : user
  )

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUsers))
  } catch {
    throw new Error('담당자를 삭제하지 못했습니다. 다시 시도해주세요.')
  }

  users = nextUsers
}