const TESTS_DATA = {
  "resultImages": {
    "MOOD_MAKER": "https://picsum.photos/seed/party1/300/200",
    "QUIET_OBSERVER": "https://picsum.photos/seed/party2/300/200",
    "PLANNER": "https://picsum.photos/seed/party3/300/200",
    "TASTER": "https://picsum.photos/seed/party4/300/200",
    "FREE_SOUL": "https://picsum.photos/seed/travel1/300/200",
    "GUIDE_MASTER": "https://picsum.photos/seed/travel2/300/200",
    "RELAX_SEEKER": "https://picsum.photos/seed/travel3/300/200",
    "LOCAL_HUNTER": "https://picsum.photos/seed/travel4/300/200",
    "HOMEBODY": "https://picsum.photos/seed/home1/300/200",
    "OUTBOUNDER": "https://picsum.photos/seed/out1/300/200",
    "HOBBY_COLLECTOR": "https://picsum.photos/seed/hobby1/300/200",
    "SOCIAL_BUTTERFLY": "https://picsum.photos/seed/social1/300/200",
    "FOCUS_KING": "https://picsum.photos/seed/study1/300/200",
    "BRAINSTORMER": "https://picsum.photos/seed/study2/300/200",
    "LAST_MINUTER": "https://picsum.photos/seed/study3/300/200",
    "CONSISTENT_RUNNER": "https://picsum.photos/seed/study4/300/200"
  },
  "tests": [
    {
      "id": "office_party",
      "title": "회식 자리 성격 테스트",
      "desc": "회식 상황에서의 내 선택으로 알아보는 나의 술자리 캐릭터!",
      "questions": [
        { "q": "회식 장소에 도착했을 때, 당신의 자리는?", "options": [{ "text": "사람들이 많은 중앙 자리", "scores": { "MOOD_MAKER": 1 } }, { "text": "조용히 나갈 수 있는 구석 자리", "scores": { "QUIET_OBSERVER": 1 } }] },
        { "q": "메뉴를 정할 때, 당신은?", "options": [{ "text": "가장 인기 있는 추천 메뉴!", "scores": { "MOOD_MAKER": 1 } }, { "text": "미리 리뷰를 찾아보고 가성비 좋은 메뉴", "scores": { "PLANNER": 1 } }] },
        { "q": "주문한 음식이 나왔을 때!", "options": [{ "text": "먹기 전 사진부터! 인스타 감성 샷", "scores": { "TASTER": 1 } }, { "text": "식기 전에 빨리 나눠주는 효율성", "scores": { "PLANNER": 1 } }] },
        { "q": "회식 분위기가 무르익었을 때?", "options": [{ "text": "건배사를 주도하고 분위기를 띄운다", "scores": { "MOOD_MAKER": 1 } }, { "text": "조용히 고기를 굽거나 빈 잔을 채운다", "scores": { "PLANNER": 1 } }] },
        { "q": "옆 사람이 어색해 보일 때?", "options": [{ "text": "먼저 말을 걸어 분위기를 푼다", "scores": { "MOOD_MAKER": 1 } }, { "text": "그저 묵묵히 들어주며 웃어준다", "scores": { "QUIET_OBSERVER": 1 } }] },
        { "q": "술이 약한 친구가 난처해한다면?", "options": [{ "text": "대신 마셔주며 흑기사를 자처한다", "scores": { "MOOD_MAKER": 1 } }, { "text": "조용히 콜라나 물을 챙겨다 준다", "scores": { "QUIET_OBSERVER": 1 } }] },
        { "q": "갑자기 분위기가 맛 평가단이 된다면?", "options": [{ "text": "이 집의 숨겨진 양념 비법을 열거한다", "scores": { "TASTER": 1 } }, { "text": "묵묵히 가장 맛있는 부위만 골라 먹는다", "scores": { "QUIET_OBSERVER": 1 } }] },
        { "q": "회식을 마무리하며 계산할 때 당신은?", "options": [{ "text": "영수증을 챙기고 n분의 1을 계산한다", "scores": { "PLANNER": 1 } }, { "text": "오늘 너무 맛있었다며 사장님께 인사한다", "scores": { "TASTER": 1 } }] }
      ]
    },
    {
      "id": "travel_style",
      "title": "나의 여행 스타일은?",
      "desc": "낯선 곳으로 떠났을 때 나타나는 나의 본모습은?",
      "questions": [
        { "q": "여행 계획을 세울 때 당신은?", "options": [{ "text": "운명에 맡긴다! 발길 닿는 대로", "scores": { "FREE_SOUL": 1 } }, { "text": "분 단위로 쪼갠 완벽한 일정표", "scores": { "GUIDE_MASTER": 1 } }] },
        { "q": "유명한 맛집 앞에 긴 줄이 있다면?", "options": [{ "text": "기다리는 것도 여행! 무조건 줄을 선다", "scores": { "GUIDE_MASTER": 1 } }, { "text": "옆 가게도 맛있겠지! 그냥 들어간다", "scores": { "FREE_SOUL": 1 } }] },
        { "q": "숙소를 고를 때 가장 중요한 것은?", "options": [{ "text": "현지 느낌 물씬 풍기는 이색적인 곳", "scores": { "LOCAL_HUNTER": 1 } }, { "text": "교통이 편리하고 깔끔한 정석 호텔", "scores": { "RELAX_SEEKER": 1 } }] },
        { "q": "여행지에서 아침 8시, 당신은?", "options": [{ "text": "조식 오픈런! 하나라도 더 봐야지", "scores": { "GUIDE_MASTER": 1 } }, { "text": "점심쯤 일어나서 느긋하게 커피 한 잔", "scores": { "RELAX_SEEKER": 1 } }] },
        { "q": "모르는 골목길에서 길을 잃었다면?", "options": [{ "text": "이것도 여행의 묘미! 그냥 걸어본다", "scores": { "FREE_SOUL": 1 } }, { "text": "지도의 평점 낮은 관광지로 가본다", "scores": { "LOCAL_HUNTER": 1 } }] },
        { "q": "여행 중 사진 찍는 스타일은?", "options": [{ "text": "풍경과 소품 위주의 예술적 기록", "scores": { "LOCAL_HUNTER": 1 } }, { "text": "내가 잘 나온 인생샷 위주의 기록", "scores": { "RELAX_SEEKER": 1 } }] },
        { "q": "예상치 못한 비가 온다면?", "options": [{ "text": "실내 플랜 B 가동! 바로 이동한다", "scores": { "GUIDE_MASTER": 1 } }, { "text": "숙소에서 빗소리 들으며 낮잠 자기", "scores": { "RELAX_SEEKER": 1 } }] },
        { "q": "마지막 날, 기념품을 살 때?", "options": [{ "text": "남들 다 사는 유명한 시장 기념품", "scores": { "FREE_SOUL": 1 } }, { "text": "나만 아는 골목 빈티지 샵의 보물", "scores": { "LOCAL_HUNTER": 1 } }] }
      ]
    },
    {
      "id": "weekend_life",
      "title": "주말을 보내는 나의 자세",
      "desc": "기다리고 기다리던 주말! 당신은 무엇을 하나요?",
      "questions": [
        { "q": "토요일 아침, 눈을 떴을 때?", "options": [{ "text": "여유로운 늦잠! 이불 밖은 위험해", "scores": { "HOMEBODY": 1 } }, { "text": "오늘 일정을 떠올리며 벌떡 일어난다", "scores": { "OUTBOUNDER": 1 } }] },
        { "q": "친구에게서 '지금 나올래?' 연락이 왔다면?", "options": [{ "text": "이미 침대와 한 몸... 다음에 보자", "scores": { "HOMEBODY": 1 } }, { "text": "좋아! 어디로 가면 돼?", "scores": { "SOCIAL_BUTTERFLY": 1 } }] },
        { "q": "갑자기 새로운 걸 배워보고 싶다면?", "options": [{ "text": "원데이 클래스 같은 체험 활동 예약", "scores": { "HOBBY_COLLECTOR": 1 } }, { "text": "유튜브로 독학하며 혼자 해보기", "scores": { "HOMEBODY": 1 } }] },
        { "q": "주말 저녁, 파티가 열린다면?", "options": [{ "text": "모르는 사람들과도 금방 친해진다", "scores": { "SOCIAL_BUTTERFLY": 1 } }, { "text": "친한 사람 몇 명과 구석에서 대화한다", "scores": { "HOBBY_COLLECTOR": 1 } }] },
        { "q": "SNS에 오늘을 기록한다면?", "options": [{ "text": "북적북적 친구들과 만난 사진", "scores": { "SOCIAL_BUTTERFLY": 1 } }, { "text": "직접 만든 요리나 완성한 작업물", "scores": { "HOBBY_COLLECTOR": 1 } }] },
        { "q": "날씨가 너무 좋을 때 당신의 선택은?", "options": [{ "text": "창문을 열고 집에서 햇살 즐기기", "scores": { "HOMEBODY": 1 } }, { "text": "밖으로 나가서 한강이나 공원 걷기", "scores": { "OUTBOUNDER": 1 } }] },
        { "q": "밀린 집안일을 해야 한다면?", "options": [{ "text": "최대한 미루다 주말 끝자락에 한다", "scores": { "OUTBOUNDER": 1 } }, { "text": "아침부터 청소하며 환경을 정리한다", "scores": { "HOBBY_COLLECTOR": 1 } }] },
        { "q": "다음 주를 준비하는 일요일 밤?", "options": [{ "text": "명상이나 독서로 마음을 가라앉힌다", "scores": { "HOMEBODY": 1 } }, { "text": "내일 입을 옷을 미리 준비하고 계획한다", "scores": { "OUTBOUNDER": 1 } }] }
      ]
    },
    {
      "id": "study_type",
      "title": "공부할 때 나의 모습",
      "desc": "집중의 순간, 나는 어떤 타입일까?",
      "questions": [
        { "q": "시험 기간, 공부를 시작하는 시점은?", "options": [{ "text": "시험 공지 뜬 날부터 매일 조금씩", "scores": { "CONSISTENT_RUNNER": 1 } }, { "text": "시험 전날 밤, 벼락치기의 스릴", "scores": { "LAST_MINUTER": 1 } }] },
        { "q": "공부할 때 가장 효과적인 방법은?", "options": [{ "text": "혼자 정독하며 요약 정리하기", "scores": { "FOCUS_KING": 1 } }, { "text": "친구에게 가르쳐주며 이해하기", "scores": { "BRAINSTORMER": 1 } }] },
        { "q": "새로운 문제집을 샀을 때?", "options": [{ "text": "1페이지부터 차례대로 풀어나간다", "scores": { "CONSISTENT_RUNNER": 1 } }, { "text": "가장 재미있어 보이는 단원부터 푼다", "scores": { "BRAINSTORMER": 1 } }] },
        { "q": "공부 장소를 정할 때?", "options": [{ "text": "소음 하나 없는 정적인 공간", "scores": { "FOCUS_KING": 1 } }, { "text": "사람들 소리가 들리는 활기찬 카페", "scores": { "BRAINSTORMER": 1 } }] },
        { "q": "공부 중 스마트폰 유혹이 온다면?", "options": [{ "text": "잠금 앱을 쓰거나 멀리 둔다", "scores": { "FOCUS_KING": 1 } }, { "text": "중간중간 답장하며 멀티태스킹한다", "scores": { "LAST_MINUTER": 1 } }] },
        { "q": "리포트 제출 마감 1시간 전?", "options": [{ "text": "이미 제출 완료하고 검토 중", "scores": { "CONSISTENT_RUNNER": 1 } }, { "text": "지금이 최고의 집중력! 타이핑 가속", "scores": { "LAST_MINUTER": 1 } }] },
        { "q": "문제를 풀다 몰르는 게 나오면?", "options": [{ "text": "답지를 안 보고 30분 이상 고민한다", "scores": { "FOCUS_KING": 1 } }, { "text": "인터넷이나 질문방에 바로 물어본다", "scores": { "LAST_MINUTER": 1 } }] },
        { "q": "계획표를 짤 때 나의 스타일?", "options": [{ "text": "성취감을 위한 체크리스트 식", "scores": { "CONSISTENT_RUNNER": 1 } }, { "text": "그날의 기분에 따른 자유로운 배정", "scores": { "BRAINSTORMER": 1 } }] }
      ]
    }
  ]
};
