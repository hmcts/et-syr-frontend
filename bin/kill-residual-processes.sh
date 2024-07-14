#!/usr/bin/env bash

set -eu

echo "Checking port 3003"
processId_3003=`lsof -i -n -P | grep LISTEN | grep :3003 | awk '{print $2}'`

if [ ! -z "$processId_3003" ]
then
  echo "killing process with Id $processId_3003"
  kill -9 "$processId_3003"
else
  echo "There is no process running on port 3003"
fi

