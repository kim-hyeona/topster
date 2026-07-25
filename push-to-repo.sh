#!/bin/bash
# 기존 topster 레포에 Vue 프로젝트로 덮어쓰기

REMOTE_URL="https://github.com/kim-hyeona/topster.git"

# 현재 디렉토리를 git 레포로 초기화
git init
git remote add origin $REMOTE_URL

# 기존 main 브랜치 히스토리 가져오기 (--allow-unrelated-histories 대비)
git fetch origin main

# 전체 파일 스테이징
git add .
git commit -m "refactor: Vue 3 + Vite로 전환"

# 강제 푸쉬 (기존 바닐라 코드 덮어쓰기)
git push -f origin main

echo "완료!"
