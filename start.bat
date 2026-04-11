@echo off
title P.E.T 펫에토 - 개발 서버
echo ============================================
echo   P.E.T 펫에토 개발 서버를 시작합니다...
echo ============================================
echo.
cd /d "C:\Users\dnlsd\OneDrive\바탕 화면\대욱\클로드\pet-eto-web"
echo [1/3] 최신 코드 가져오는 중...
git pull origin main
echo.
echo [2/3] 캐시 정리 중...
if exist ".next" rmdir /s /q ".next" 2>nul
echo.
echo [3/3] 서버 시작 중... (http://localhost:3000)
echo ============================================
echo   브라우저에서 http://localhost:3000 접속
echo   종료: 이 창에서 Ctrl+C
echo ============================================
npm run dev
pause
