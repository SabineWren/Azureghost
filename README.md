World boss timers created for Dragonwatch.

<img src="/Media/preview.png" height="415px">

## Commands
#### Clear
`/clear [boss: dropdown]`

Removes kill time for the boss.

#### Emoji
`/emoji [boss: dropdown] [emoji?: text]`

Sets custom emoji for a boss. Leave blank to clear.

#### Kill
`/kill [boss: dropdown] [year?: 2025+] [month?: dropdown] [day?: -31 to 31] [hour?: -59 to 59] [minute?: -59 to 59]`

Sets kill time for a boss using server timezone.
- Omitted values default to current time.
- Positive values override current time.
- Negative values subtract from current time.
- Future DateTime will return an error.

#### Timezone
`/timezone [timezone: text]`

Sets server timezone code, ex. `UTC` or `Europe/London`

## Local Development
```
# Port forward
ngrok http 3000 --url $NGROK_DOMAIN
```
