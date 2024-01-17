#!/bin/bash
: '
The following script runs once every Tuesday and Thursday in order to prepare the emails that will be sent out into the system.
'

cd "${0%/*}/.."
npm run match && touch cron/results/match && echo "1" > cron/results/match