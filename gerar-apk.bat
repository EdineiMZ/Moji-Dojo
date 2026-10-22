@echo off
setlocal
cd /d "%~dp0"
title Moji Dojo - gerar APK (build local)

echo ============================================
echo   Moji Dojo - gerar APK (build local)
echo ============================================
echo.

rem --- Ferramentas: Node, JDK e Android SDK ---
where node >nul 2>nul
if errorlevel 1 (
  echo [ERRO] Node.js nao encontrado. Instale em https://nodejs.org
  goto :erro
)

if not defined ANDROID_HOME set "ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk"
if not exist "%ANDROID_HOME%\platforms" (
  echo [ERRO] Android SDK nao encontrado em "%ANDROID_HOME%".
  echo        Instale o Android Studio ou defina ANDROID_HOME.
  goto :erro
)
set "ANDROID_SDK_ROOT=%ANDROID_HOME%"

if not defined JAVA_HOME (
  if exist "C:\Program Files\Java\jdk-21" set "JAVA_HOME=C:\Program Files\Java\jdk-21"
  if exist "C:\Program Files\Java\jdk-17" set "JAVA_HOME=C:\Program Files\Java\jdk-17"
)
if not defined JAVA_HOME (
  echo [ERRO] JDK nao encontrado. Instale o JDK 17 ou 21 e defina JAVA_HOME.
  goto :erro
)
set "PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%PATH%"
echo Node : & node -v
for /f "delims=" %%v in ('node scripts\version.mjs apk-name') do set "APK_NAME=%%v"
for /f "delims=" %%v in ('node scripts\version.mjs show') do echo App  : %%v
echo Java : %JAVA_HOME%
echo SDK  : %ANDROID_HOME%
echo.

rem --- 1. Dependencias ---
if not exist node_modules (
  echo [1/4] Instalando dependencias ^(npm ci^)...
  call npm ci
  if errorlevel 1 goto :erro
) else (
  echo [1/4] Dependencias ja instaladas.
)

rem --- 2. Projeto Android nativo (gerado a partir do app.json) ---
rem Daemons do Gradle de builds anteriores seguram arquivos de android\ e fazem o prebuild falhar (EBUSY).
if exist android\gradlew.bat call android\gradlew.bat --stop >nul 2>nul
echo.
echo [2/4] Gerando o projeto Android ^(expo prebuild^)...
call npx expo prebuild --platform android
if errorlevel 1 goto :erro
> "android\local.properties" echo sdk.dir=%ANDROID_HOME:\=\\%

rem --- 3. Compilar o APK de release ---
echo.
echo [3/4] Compilando o APK ^(Gradle; o primeiro build baixa dependencias e leva varios minutos^)...
pushd android
rem So arm64-v8a (celulares atuais de 64 bits): o APK fica bem menor. Para aparelhos antigos de 32 bits,
rem troque por arm64-v8a,armeabi-v7a.
call gradlew.bat assembleRelease -PreactNativeArchitectures=arm64-v8a
set "GRADLE_EXIT=%errorlevel%"
popd
if not "%GRADLE_EXIT%"=="0" goto :erro

rem --- 4. Copiar o resultado para a raiz ---
echo.
echo [4/4] Copiando o APK...
copy /y "android\app\build\outputs\apk\release\app-release.apk" "%APK_NAME%" >nul
if errorlevel 1 goto :erro

echo.
echo Pronto: %~dp0%APK_NAME%
echo Copie para o celular e instale ^(permita "apps desconhecidos" se o Android pedir^).
goto :fim

:erro
echo.
echo [ERRO] O build falhou. Leia a mensagem acima.

:fim
echo.
pause
endlocal
