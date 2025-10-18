@echo off
echo Installing Firebase CLI...
npm install -g firebase-tools

echo Logging into Firebase...
firebase login

echo Installing Cloud Functions dependencies...
cd functions
npm install
cd ..

echo Starting Firebase emulators...
firebase emulators:start