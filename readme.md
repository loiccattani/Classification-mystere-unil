Install + config
```bash
ssh compi@130.223.74.19
sudo apt update
sudo apt install nginx
touch .config/labwc/autostart
nano .config/labwc/autostart
```
to add in autostart file:
node "/home/compi/m25-gem-classification/index.js" &
firefox -kiosk "http://localhost/Classification-mystere-unil/"

Locally:
```bash
npm run build
npm run "push A"