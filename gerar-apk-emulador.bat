@echo off
rem APK para testar no emulador do Android Studio (x86_64). O gerar-apk.bat gera so arm64-v8a, que fecha no emulador
rem com "couldn't find DSO to load: libreactnative.so". Este usa x86_64 e deixa o resultado em
rem android\app\build\outputs\apk\release\app-release.apk, sem copiar para a pasta de versoes.
rem Instalar: adb install -r android\app\build\outputs\apk\release\app-release.apk
set "ARCHS=x86_64"
set "SKIP_COPY=1"
call "%~dp0gerar-apk.bat"
