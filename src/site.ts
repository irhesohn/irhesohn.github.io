// 사이트 전체에서 쓰는 기본 정보. 여기만 고치면 모든 페이지에 반영됩니다.
export const site = {
  name: 'Irhe Sohn',
  nameKo: '손이레', // 한국어 페이지에 표시되는 이름
  email: 'isohn@smith.edu',
  cv: 'cv.pdf', // public/cv.pdf 로 파일을 넣으면 연결됩니다
  en: {
    tag:
      'Film & Media Studies · Korea & East Asia',
    // <em> 안의 낱말이 포인트 색 이탤릭으로 표시됩니다
    hero: 'Histories of film<br>and media<br><em>yet to come</em>.',
    intro:
      'Irhe Sohn is Assistant Professor of Korean in the Department of East Asian Languages and Cultures at Smith College. A historian of Korean film and media, Sohn writes on colonial-era cinema, lost films, and the place of affect and failure in film historiography.',
    affiliation: ['Department of East Asian Languages and Cultures', 'Smith College, Northampton, Massachusetts'],
    research:
      'Colonial-era cinema, lost films, and the place of affect and failure in film historiography.',
    teaching:
      'Korean cinema and its mass audiences, women and narration in modern Korea, audiovisual translation, and democracy in film and media.',
  },
  ko: {
    tag:
      '영화·미디어 연구 · 한국과 동아시아',
    hero: '<em>아직 오지 않은</em><br>영화와 미디어의<br>역사.',
    intro:
      '손이레는 Smith College 동아시아언어문화학과 조교수(Assistant Professor of Korean)입니다. 한국 영화와 미디어의 역사를 연구하며, 식민지 시기 영화와 유실된 영화, 그리고 영화사 서술에서 정동과 실패가 차지하는 자리에 대해 씁니다.',
    affiliation: ['Smith College 동아시아언어문화학과', '미국 매사추세츠주 노샘프턴'],
    research:
      '식민지 시기 영화와 유실된 영화, 영화사 서술에서 정동과 실패가 차지하는 자리.',
    teaching:
      '한국 영화와 대중, 근대 한국의 여성과 서사, 영상 번역, 영화와 미디어 속 민주주의.',
  },
};
