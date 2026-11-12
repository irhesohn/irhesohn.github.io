import { defineConfig } from 'astro/config';

// 배포할 때 아래 두 값을 실제 주소로 바꿉니다.
//   site: 'https://<아이디>.github.io'
//   base: '/<저장소 이름>'   (저장소 이름이 <아이디>.github.io 이면 base 줄은 지웁니다)
export default defineConfig({
  site: process.env.SITE_URL || 'https://example.github.io',
  base: process.env.BASE_PATH || '/',
  // node_modules 가 iCloud 동기화를 피하려고 바로가기(node_modules.nosync)로 되어 있어 필요한 설정
  vite: { resolve: { preserveSymlinks: true } },
});
