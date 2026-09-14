export const MODEL = {
  cylinder: "/models/cylinder.glb",
  regulator: "/models/regulator.glb",
  wrench: "/models/wrench.glb",
  hose: "/models/hose.glb",
  n2Reg: "/models/n2-reg.glb",
  n2RegHose: "/models/n2-reg-hose.glb",
  outlet: "/models/outlet.glb",
  chair: "/models/chair.glb",
  silence: "/models/silence.glb",
} as const;

export const CODEX_ENTRIES = [
  {
    id: "cylinder",
    url: MODEL.cylinder,
    title: "질소 실린더",
    blurb: "40 cu ft 질소 탱크. 상단 목에 메인 밸브가 있습니다.",
  },
  {
    id: "regulator",
    url: MODEL.regulator,
    title: "레귤레이터·플로우미터",
    blurb: "질소용 일체형. 고압 게이지와 유량 노브가 붙어 있습니다.",
  },
  {
    id: "wrench",
    url: MODEL.wrench,
    title: "몽키스패너",
    blurb: "레귤레이터·호스 너트를 적당히 조일 때 사용합니다.",
  },
  {
    id: "hose",
    url: MODEL.hose,
    title: "고압 호스",
    blurb: "플로우미터 출력구에 연결하는 질소 배출 호스입니다.",
  },
  {
    id: "n2reg",
    url: MODEL.n2Reg,
    title: "질소 + 레귤레이터",
    blurb: "실린더에 레귤레이터를 체결한 상태입니다.",
  },
  {
    id: "full",
    url: MODEL.n2RegHose,
    title: "질소 + 레귤레이터 + 호스",
    blurb: "호스까지 모두 연결한 완성 조립입니다.",
  },
  {
    id: "outlet",
    url: MODEL.outlet,
    title: "호스 말단 결합 키트",
    blurb: "호스 말단을 결합하면 이 키트로 바뀝니다.",
  },
  {
    id: "chair",
    url: MODEL.chair,
    title: "작업 의자",
    blurb: "산업용 실린더 옆에 두는 작업 의자입니다. 말단 결합 후 누르면 최종 형태가 나타납니다.",
  },
  {
    id: "silence",
    url: MODEL.silence,
    title: "최종 결합 형태",
    blurb: "말단 결합을 마친 뒤 의자를 누르면 나타나는 최종 모델입니다.",
  },
] as const;

export type CodexId = (typeof CODEX_ENTRIES)[number]["id"];
