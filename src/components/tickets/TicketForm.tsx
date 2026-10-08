import AssigneeSelect from './AssigneeSelect'
import type { TicketStatus } from '../../types'

// 생성·수정 화면에서 공통으로 사용하는 입력값
export interface TicketFormValues {
  title: string
  description: string
  assigneeId: string
  status: TicketStatus
  startDate: string
  dueDate: string
}

interface TicketFormProps {
  values: TicketFormValues
  onChange: (values: TicketFormValues) => void
}

const inputStyle =
  'mt-2 w-full min-w-0 rounded-lg border border-[#14324B]/15 bg-white/20 px-3 py-3 text-base text-[#14324B] outline-none transition-colors placeholder:text-[#718694] focus:border-[#476C80] focus:bg-white/40 focus:ring-2 focus:ring-[#476C80]/10 sm:text-sm'

const labelStyle = 'block text-sm font-medium text-[#425D73]'

// 티켓 생성·수정 공통 입력 영역
function TicketForm({ values, onChange }: TicketFormProps) {
  // 변경한 항목만 새 값으로 교체
  function updateField<K extends keyof TicketFormValues>(
    field: K,
    value: TicketFormValues[K]
  ) {
    onChange({
      ...values,
      [field]: value,
    })
  }

  return (
    <>
      <p className="mb-5 text-xs text-[#526D82]">
        <span className="text-[#9A5050]">*</span> 필수 입력 항목
      </p>

      {/* 제목과 내용 */}
      <div className="space-y-6">
        <label className={labelStyle}>
          제목
          <span className="ml-2 text-xs font-normal text-[#526D82]">
            *
          </span>
          <input
            type="text"
            value={values.title}
            onChange={(event) =>
              updateField('title', event.target.value)
            }
            placeholder="어떤 업무가 필요한가요?"
            aria-required="true"
            className={inputStyle}
          />
        </label>

        <label className={labelStyle}>
          내용
          <span className="ml-2 text-xs font-normal text-[#526D82]">
            *
          </span>
          <textarea
            value={values.description}
            onChange={(event) =>
              updateField('description', event.target.value)
            }
            placeholder="요청 배경과 필요한 작업을 작성해주세요."
            rows={8}
            aria-required="true"
            className={`${inputStyle} resize-y leading-7`}
          />
        </label>
      </div>

      {/* 담당자·상태·마감일 */}
      <div className="mt-7 grid gap-5 border-t border-[#14324B]/10 pt-6 sm:grid-cols-2 lg:grid-cols-4">
        <AssigneeSelect
          value={values.assigneeId}
          onChange={(value) => updateField('assigneeId', value)}
          inputClassName={inputStyle}
        />

        <label className={`${labelStyle} min-w-0`}>
          상태
          <select
            value={values.status}
            onChange={(event) => {
              const value = event.target.value

              if (
                value === 'open' ||
                value === 'in_progress' ||
                value === 'resolved'
              ) {
                updateField('status', value)
              }
            }}
            className={inputStyle}
          >
            <option value="open">진행 전</option>
            <option value="in_progress">진행</option>
            <option value="resolved">완료</option>
          </select>
        </label>

        <label className={`${labelStyle} min-w-0`}>
          시작일
          <span className="ml-2 text-xs font-normal text-[#526D82]">
            (선택)
          </span>
          <input
            type="date"
            value={values.startDate}
            onChange={(event) =>
              updateField('startDate', event.target.value)
            }
            className={inputStyle}
          />
        </label>

        <label className={`${labelStyle} min-w-0`}>
          마감일
          <span className="ml-2 text-xs font-normal text-[#526D82]">
            (선택)
          </span>
          <input
            type="date"
            value={values.dueDate}
            onChange={(event) =>
              updateField('dueDate', event.target.value)
            }
            className={inputStyle}
          />
        </label>
      </div>
    </>
  )
}

export default TicketForm