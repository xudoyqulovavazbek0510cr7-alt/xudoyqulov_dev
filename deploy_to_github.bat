@echo off
title xudoyqulov.dev Portfolio - GitHub ga yuklash
color 0a

echo ========================================================
echo   xudoyqulov.dev Portfoliosini GitHub ga Joylashtirish Skripti
echo ========================================================
echo.

where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [XATOLIK] Git kompyuteringizda o'rnatilmagan!
    echo Iltimos, https://git-scm.com/downloads manzilidan Git dasturini o'rnating.
    echo.
    pause
    exit /b
)

echo 1. Git ombori tekshirilmoqda...
if not exist ".git" (
    git init
    echo [OK] Git initsializatsiya qilindi.
)

echo 2. Barcha fayllar qo'shilmoqda...
git add .

echo 3. Kommit yaratilmoqda...
git commit -m "Update portfolio website" || git commit -m "Update"

echo 4. Asosiy tarmoq 'main' ga sozlanmoqda...
git branch -M main

echo.
echo ========================================================
echo Tanlangan havola: https://github.com/xudoyqulovavazbek0510cr7-alt/xudoyqulov_dev.git
echo ========================================================
echo.

set "REPO_URL=https://github.com/xudoyqulovavazbek0510cr7-alt/xudoyqulov_dev.git"
echo.

git remote remove origin >nul 2>nul
git remote add origin %REPO_URL%
echo 5. GitHub ga yuklanmoqda (Push)...
git push -u origin main
if %errorlevel% equ 0 (
    echo.
    echo ========================================================
    echo [MUVAFFAQIN!] Loyihangiz GitHub ga muvaffaqiyatli yuklandi!
    echo Endi GitHub Pages orqali saytni bepul jonli efirga chiqarishingiz mumkin!
    echo ========================================================
) else (
    echo.
    echo [OGOHLANTIRISH] GitHub ga yuklashda xatolik bo'ldi.
    echo 1. GitHub da ushbu nomdagi repo yaratilganiga ishonch hosil qiling.
    echo 2. Agar brauzerda GitHub login so'ralsa, 'Sign in with your browser' ni bosing.
)

echo.
pause
