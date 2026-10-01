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

// 담당자 목록 조회
export function getUsers(): User[] {
  return [...users]
}

// 이름 검사 후 새 담당자 저장
export function createUser(name: string): User {
  const trimmedName = name.trim()

  if (!trimmedName) {
    throw new Error('담당자 이름을 입력해주세요.')
  }

  const newUser: User = {
    id: Math.max(0, ...users.map((user) => user.id)) + 1,
    name: trimmedName,
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