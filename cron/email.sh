#!/bin/bash
: '
The following script runs every time at 5:30 only if the match script has been completely. If the match script has not been
completed we will be notified.
'
cd "${0%/*}/.."

MATCHED=$(head -c 1 cron/results/match)
ATTEMPTS="30"
BETWEEN="5m"

# Make sure that if we have not finished matching we will keep retyring to send emails
# until the script has finisehd. We do this every 5 minutes
if [[ $MATCHED == "0" ]]; then
    for i in `seq 1 $ATTEMPTS`
    do
        MATCHED=$(head -c 1 cron/results/match)

        # If the script finished then run the email script. If we ran out of tries then exit.
        if [[ $MATCHED == "1" ]]; then
            break
        elif [[ $i == $ATTEMPTS ]]; then
            exit 0
        fi
        
        # Otherwise just sleep.
        sleep $BETWEEN
    done
fi

echo "0" > cron/results/match
npm run email
