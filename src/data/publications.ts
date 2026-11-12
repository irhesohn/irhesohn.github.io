// 출판물 목록. 연구 페이지에 연도 단과 함께 표시됩니다.
// 제목·서지 정보 안의 *기울임*은 이탤릭으로 바뀝니다.
// status 가 있으면 연도 대신 제목 옆에 작은 표시가 붙습니다.
//   en / ko 값이 같으면 ko 는 생략해도 됩니다.

type Text = { en: string; ko?: string };
export type Pub = { year?: string; status?: Text; title: Text; venue: Text };

export const books: Pub[] = [
  {
    status: { en: 'Forthcoming', ko: '근간' },
    title: { en: '*Promises of Failure: Dreams of Cinema in Colonial Korea*' },
    venue: { en: 'Rutgers University Press.' },
  },
];

export const articles: Pub[] = [
  {
    status: { en: 'Under review', ko: '심사 중' },
    title: { en: '“Cinema, the Demand of Our People: The Politics of Address in Early Cinema of Colonial Korea”' },
    venue: {
      en: 'In *The Oxford Handbook of Korean Cinema*, edited by Ungsan Kim and Sangjoon Lee. Oxford University Press.',
    },
  },
  {
    year: '2022',
    title: {
      en: '“Writing Boys and Uppity Girls: Gendered Subjectivities of Children in Late-colonial Korean Cinema”',
      ko: '「글 쓰는 소년과 시건방진 소녀: 식민지 말기 조선영화 소국민 서사의 젠더화」',
    },
    venue: {
      en: '*Asian Cinema Studies* 15.3 (December): 7–36. In Korean.',
      ko: '『아시아영화연구』 15.3 (12월): 7–36.',
    },
  },
  {
    year: '2022',
    title: { en: '“Field of Revision: Adaptations of *Wren’s Elegy* by Mo Yunsuk and Kim Kiyoung”' },
    venue: {
      en: 'Co-authored with Ki-in Chong. *Adaptation* 15.1 (March): 100–112.',
      ko: 'Ki-in Chong 공저. *Adaptation* 15.1 (3월): 100–112.',
    },
  },
  {
    year: '2019',
    title: { en: '“Imperial Ethos, Colonial Pathos: Affective Realism of Colonial Korean Cinema”' },
    venue: {
      en: 'In *Tracing the Footsteps of Motion Pictures: An Anthology of Early Taiwanese and East Asian Cinemas*, edited by Daw-Ming Lee. Taipei: Taiwan National University of the Arts. Translated into Chinese by Mei-Hsuan Chiang.',
      ko: 'In *Tracing the Footsteps of Motion Pictures: An Anthology of Early Taiwanese and East Asian Cinemas*, edited by Daw-Ming Lee. Taipei: Taiwan National University of the Arts. 영어로 쓰고 Mei-Hsuan Chiang이 중국어로 번역.',
    },
  },
  {
    year: '2018',
    title: { en: '“Peripheral Visions of Yusin: Techniscope Action Cinema and the Anxiety of the State”' },
    venue: {
      en: 'In *Cultures of Yusin: South Korea in the 1970s*, edited by Youngju Ryu. Ann Arbor: University of Michigan Press.',
    },
  },
  {
    year: '2018',
    title: {
      en: '“A Coming Korean Cinema and Its Singularity: Rethinking Im Hwa’s *Treatises on Korean Cinema*”',
      ko: '「도래해야 하는 식민지 조선영화의 고유성: 임화의 조선영화론 재고」',
    },
    venue: {
      en: 'In *Conversations of East Asian Intellectuals*, edited by Soyoung Kim. Seoul: Hyŏnsil Munhwa. In Korean.',
      ko: '김소영 엮음, 『동아시아 지식인의 대화』. 서울: 현실문화.',
    },
  },
  {
    year: '2015',
    title: { en: '“*Im Hwa’s Cinema* vs. Im Hwa’s Cinema”', ko: '「<임화의 영화> 대 임화의 영화」' },
    venue: { en: '*Sai* 18 (Fall): 249–276. In Korean.', ko: '*Sai* 18 (가을): 249–276.' },
  },
  {
    year: '2007',
    title: {
      en: '“Play, Pause: Female Representation in Narrative Cinema of Colonial Korea”',
      ko: '「재생, 일시정지: 식민지 조선의 서사영화와 여성 재현의 정치학」',
    },
    venue: {
      en: '*Journal of Popular Narratives* 18 (Winter): 289–323. In Korean.',
      ko: '『대중서사연구』 18 (겨울): 289–323.',
    },
  },
];
