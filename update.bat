@echo off
set /p msg="Digite a mensagem do commit (ou aperte Enter para padrao): "
if "%msg%"=="" set msg=update: melhorias no sistema
git add .
git commit -m "%msg%"
git push origin main
echo.
echo =========================================
echo  ATUALIZACAO ENVIADA COM SUCESSO! 🚀
echo =========================================
pause
