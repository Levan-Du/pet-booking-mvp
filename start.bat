@echo off
echo ?? ��������ԤԼϵͳ...

echo.
echo ?? 1. ������˷���...
cd back-end
start "Backend Server" cmd /k "npm run dev"

echo.
echo ? �ȴ���˷�������...
timeout /t 3 /nobreak > nul

echo.
echo ?? 2. ����ǰ����Ŀ...
cd ../front-end-taro
start "Frontend Dev" cmd /k "npm run dev:h5"

echo.
echo ? ϵͳ������ɣ�
echo ?? ��˷���: http://localhost:3000
echo ?? ǰ��ҳ��: ��鿴 HBuilderX ����̨
echo ?? ����ҳ��: /pages/test-admin
echo ?? Admin ��¼: /pages/admin/admin

pause