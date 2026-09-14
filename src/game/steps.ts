export const STEP_IDS = [
  "remove_cap",
  "hand_fit",
  "wrench_reg",
  "fit_hose",
  "wrench_hose",
  "open_cyl",
  "check_psi",
  "open_flow",
  "check_flow",
  "soap_n2",
  "soap_hose",
  "fit_outlet",
  "press_chair",
] as const;

export type StepId = (typeof STEP_IDS)[number];

export type InteractId =
  | "cap"
  | "regulator"
  | "wrench"
  | "hose"
  | "soap"
  | "joint_reg"
  | "joint_hose"
  | "valve_cyl"
  | "valve_flow"
  | "hp_gauge"
  | "flowmeter"
  | "outlet"
  | "chair";

export type Minigame = "tighten_reg" | "tighten_hose" | "open_cyl" | "set_flow" | null;

export const STEPS: {
  id: StepId;
  index: number;
  title: string;
  hint: string;
  action: string;
  highlights: InteractId[];
}[] = [
  {
    id: "remove_cap",
    index: 0,
    title: "보호캡 제거",
    hint: "실린더 상단 보호캡을 반시계 방향으로 풀어 제거하세요.",
    action: "캡 제거",
    highlights: ["cap"],
  },
  {
    id: "hand_fit",
    index: 1,
    title: "레귤레이터 수체결",
    hint: "레귤레이터·플로우미터 일체형을 밸브에 맞추고 시계 방향으로 손으로 끼우세요.",
    action: "손으로 체결",
    highlights: ["regulator"],
  },
  {
    id: "wrench_reg",
    index: 2,
    title: "레귤레이터 조이기",
    hint: "레귤레이터 너트를 시계 방향(오른쪽)으로 돌려 적당히 조이세요. 너무 세게 조이면 나사선이 손상됩니다.",
    action: "너트 오른쪽으로 조이기",
    highlights: ["wrench", "regulator"],
  },
  {
    id: "fit_hose",
    index: 3,
    title: "호스 연결",
    hint: "고압 호스를 플로우미터 출력구에 연결하세요.",
    action: "호스 연결",
    highlights: ["hose"],
  },
  {
    id: "wrench_hose",
    index: 4,
    title: "호스 조이기",
    hint: "호스 너트도 시계 방향(오른쪽)으로 돌려 적당히 조이세요.",
    action: "호스 너트 오른쪽으로",
    highlights: ["wrench", "hose"],
  },
  {
    id: "open_cyl",
    index: 5,
    title: "실린더 밸브 개방",
    hint: "회색 손잡이를 반시계 방향으로 천천히 꺾어 여세요. 급하게 돌리면 고압이 분출합니다.",
    action: "손잡이 반시계로 꺾기",
    highlights: ["valve_cyl"],
  },
  {
    id: "check_psi",
    index: 6,
    title: "압력 확인",
    hint: "고압 게이지 바늘이 약 2,000 PSI인지 확인한 뒤 게이지를 누르세요.",
    action: "게이지 확인",
    highlights: ["hp_gauge"],
  },
  {
    id: "open_flow",
    index: 7,
    title: "유량 밸브 개방",
    hint: "레귤레이터 옆 황동 부품 맨 위 금색 톱니 노브를 왼쪽으로 돌려 여세요.",
    action: "금색 노브 왼쪽으로",
    highlights: ["valve_flow"],
  },
  {
    id: "check_flow",
    index: 8,
    title: "유량 확인",
    hint: "금색 노브: 왼쪽이면 유량 증가, 오른쪽이면 감소. 15 L/min에 맞추고 손을 떼세요.",
    action: "노브로 15 L/min",
    highlights: ["flowmeter"],
  },
  {
    id: "soap_n2",
    index: 9,
    title: "비눗물 · 질소·레귤레이터",
    hint: "질소 실린더와 레귤레이터가 맞닿은 연결부에 비눗물을 바르세요.",
    action: "질소·레귤레이터에 바르기",
    highlights: ["soap", "joint_reg"],
  },
  {
    id: "soap_hose",
    index: 10,
    title: "비눗물 · 플로우미터·호스",
    hint: "플로우미터 출력구와 호스가 맞닿은 연결부에 비눗물을 바르세요. 기포가 없으면 통과입니다.",
    action: "플로우미터·호스에 바르기",
    highlights: ["soap", "joint_hose"],
  },
  {
    id: "fit_outlet",
    index: 11,
    title: "호스 말단 결합",
    hint: "호스 끝에 투명 연결 장치를 맞춰 결합하세요. 질소가 나갈 말단입니다.",
    action: "호스 끝에 결합",
    highlights: ["outlet"],
  },
  {
    id: "press_chair",
    index: 12,
    title: "최종 형태 확인",
    hint: "실린더 옆 의자를 누르세요. 말단 결합이 끝난 뒤 최종 모델이 나타납니다.",
    action: "의자 누르기",
    highlights: ["chair"],
  },
];

export function stepById(id: StepId) {
  return STEPS.find((s) => s.id === id)!;
}

export const GREEN_MIN = 68;
export const GREEN_MAX = 86;
export const OVER_TIGHT = 92;
export const TARGET_PSI = 2040;
export const PSI_MIN = 1800;
export const PSI_MAX = 2200;
export const TARGET_FLOW = 15;
