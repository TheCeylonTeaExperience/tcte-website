#!/bin/bash

set -e

APP_DIR="/var/www/tcte"
APP_NAME="tcte"

echo ">>> Pulling latest code..."
cd $APP_DIR
git pull origin main

echo ">>> Installing dependencies..."
npm install

echo ">>> Building app..."
npm run build

echo ">>> Restarting app..."
pm2 restart $APP_NAME 2>/dev/null || pm2 start npm --name "$APP_NAME" -- start

echo ">>> Saving PM2 process list..."
pm2 save

echo ">>> Done! App is live."
pm2 status