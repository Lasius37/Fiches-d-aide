@echo off
cd /d "%~dp0"
call bundle exec jekyll serve
pause