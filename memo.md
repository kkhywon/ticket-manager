map은 티켓을 하나씩 꺼내 각 티켓에 해당하는 li를 만듦
StatusBadgeProps: 전달받을 값의 이름과 타입을 정함
STATUS_LABELS[status]: 상태에 대응하는 한글을 찾음
children: Layout의 <Outlet /> 안에 표시할 페이지
sortedTickets: 최신순으로 정렬한 티켓 배열
.length: 배열에 들어 있는 항목 수
{ }: JSX 안에서 자바스크립트 값을 표시하는 자리
thead: 열 이름을 모아두는 영역
tr: 가로 한 줄
th: 열 이름을 표시하는 칸
scope="col": 해당 제목이 세로 열을 설명한다는 의미
tbody: 실제 티켓들이 들어가는 영역
td: 실제 값이 들어가는 칸
useParams: 주소에서 지정한 값을 읽는 기능
ticket.description: 티켓 내용 표시
whitespace-pre-wrap: 내용에 저장된 줄바꿈과 공백을 유지하면서 자동 줄바꿈
ticket.assignee?.name: 담당자가 있을 때 이름을 읽음
?? '미배정': 이름이 null이나 undefined이면 ‘미배정’ 표시
StatusBadge, formatDate: 목록과 같은 방식으로 상태·날짜 표시
백틱(`): 문자열 안에 값을 넣을 수 있게 함
${ticket.id}: 해당 티켓의 ID를 주소에 넣음
<input>: 한 줄짜리 입력창
value={title}: 위에서 만든 title 값을 표시
onChange: 입력할 때마다 setTitle로 값을 바꿈
as TicketStatus: 선택한 문자열을 TicketStatus 타입으로 취급하도록 알려주는 표현
trim(): 문자열 양끝의 공백을 제거. 공백만 입력한 경우도 거름.
!: 값이 비었는지 확인
||: 둘 중 하나라도 해당하면 조건 성립
setError(''): 입력이 정상이라면 이전 안내 문구를 지움
validate: 검증하다, 입력한 값이 조건에 맞는지 확인한다
navigate: 코드에서 다른 주소로 이동할 때 사용
id: number: 조회할 티켓 번호를 숫자로 받음
tickets.find(...): 조건에 맞는 첫 번째 티켓을 찾음
ticket.id === id: 티켓 번호가 전달받은 번호와 같은지 비교
Ticket | undefined: 찾으면 티켓을, 없으면 undefined를 반환
useState: 화면에서 바뀌는 값을 기억
trim(): 검색어 앞뒤 공백 제거
toLowerCase(): 영문 대소문자 구분 없이 검색
||: 둘 중 하나라도 맞으면 통과
|: 두 종류 중 하나를 허용
&&: 둘 다 맞아야 통과
