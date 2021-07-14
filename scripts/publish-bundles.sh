#!/bin/bash

for PROJECT in $( find dist/bundles/* -maxdepth 0 -type d -printf '%f ' ); do
  echo "========== $PROJECT =========="
  cd "dist/bundles/$PROJECT" && npm publish --access public
  cd "../../../"
done
read -s -n 1 -p "Press any key to continue . . ."
echo ""
