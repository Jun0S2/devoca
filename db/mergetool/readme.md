# 📚 MergeTool for Vocab CSV

자동 단어 병합 + 중복 확인 CLI 도구입니다.  
`new.csv`에 포함된 단어들을 기존 여러 레벨의 단어들과 비교해 중복 여부를 확인하고,  
사용자의 선택에 따라 병합 결과를 `merged.csv`로 출력합니다.

---

## 🔧 How to Use

### 1. 파일 구성

```
/db/mergetool/
├── existing/
│   ├── A1 Table.csv
│   ├── A2 Table.csv
│   └── B1 Table.csv
├── new.csv             ← 새로 병합할 단어 목록
├── mergetool.py        ← 실행 스크립트
└── merged.csv          ← 병합 결과 (출력)
```

### 2. 실행

```bash
cd /db/mergetool
python mergetool.py
```

---

## ⚙️ 동작 설명

### ✅ 다른 레벨(A1, A2 등)에 동일한 단어가 존재하는 경우

- 현재 `new.csv`의 level(B1) 기준으로 병합하지 않고 **무시됨**
- 메시지 예시:

```
⚠️ Word 'das Rezept' already exists in another level. Skipping it from B1 merge.
⚠️ Word 'der Stil' already exists in another level. Skipping it from B1 merge.
⚠️ Word 'berühmt' already exists in another level. Skipping it from B1 merge.
```

---

### ✅ 같은 레벨(B1)에 동일한 단어가 존재하는 경우

- **New vs Existing** 내용을 비교하여, 사용자 선택에 따라 유지할 항목을 결정

예시:

```
Duplicate Word already exists in Existing File!
> New File :
 level: B1, word: saniert, meaning: 더미미
 example: Das Haus wurde komplett saniert.
 ...

> Existing File :
 level: B1, word: saniert, meaning: 개보수된
 example: Das Haus wurde komplett saniert.
 ...

Which one do you want to keep? (1 : New, 2 : Existing)
> 2
```

---

### 🟢 병합 완료 메시지

모든 처리가 완료되면 다음 메시지 출력과 함께 `merged.csv`에 결과 저장됩니다.

```
✅ Merge complete. Output saved to: ./merged.csv
```

---

## 💡 팁

- `new.csv`의 level은 한 종류(B1, A2 등)만 들어 있어야 합니다.
- `merged.csv`는 기존 동일 레벨 테이블(`B1 Table.csv`) 기준으로 덮어쓸 수 있도록 구성됩니다.

---

Happy Merging! 🧠📂
