#!/bin/zsh
# Runs the 10 captures as two parallel streams. Log: research/capture.log
R="/Users/user/Desktop/Development-Charlie-2/Charlieautomates/websites/Claude-Velmora/research"
chmod +x "$R/capture.sh"
(
  "$R/capture.sh" 01 skinspirit https://www.skinspirit.com siteA
  "$R/capture.sh" 02 everbody https://everbody.com siteA
  "$R/capture.sh" 03 heyday https://www.heydayskincare.com siteA
  "$R/capture.sh" 04 alchemy43 https://alchemy43.com siteA
  "$R/capture.sh" 05 ject https://www.ject.com siteA
) &
(
  "$R/capture.sh" 06 thethingswedo https://www.thethingswedo.com siteB
  "$R/capture.sh" 07 beautify https://lovebeautify.com siteB
  "$R/capture.sh" 08 dermaprecision https://dermaprecision.com siteB
  "$R/capture.sh" 09 admiremd https://www.admireplasticsurgery.com/med-spa/ siteB
  "$R/capture.sh" 10 glomedspa https://glomedspa.com siteB
) &
wait
echo "ALL CAPTURES FINISHED"
