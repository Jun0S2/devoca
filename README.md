# devoca
Web Application Service for learning German Words

## Full Stack Web Development
### German Vocabulary Learning Web Development

- Built a responsive German vocabulary learning web app with CEFR-based categorization, verb conjugation practice, and bilingual modes (DE↔KR) with TTS and progress tracking.
- 
- Webpage : https://devoca.vercel.app/

### Branch Name Rules

```
타입 | 의미 | 예시
feat/ | 새로운 기능 추가 | feat/signup-form
fix/ | 버그 수정 | fix/button-alignment
refactor/ | 리팩토링 (기능 변화 없음) | refactor/useEffect-cleanup
chore/ | 설정, 의존성, CI 등 코드 외 작업 | chore/update-eslint
docs/ | 문서 작업 | docs/readme-typo
style/ | 코드 포맷팅, CSS 수정 (논리적 변화 없음) | style/header-spacing
test/ | 테스트 코드 추가 및 수정 | test/form-validation
```

## standard-version

```bash
# install
npm install --save-dev standard-version
# commit
git commit -m "feat: add login modal"
git commit -m "fix: resolve double-click crash"
# feat:, fix:, docs:, style: refactor:, chore
# version up + changelog auto generate
# 1. 릴리즈 실행
npx standard-version
# 2. 푸시
git push origin main --follow-tags

```
