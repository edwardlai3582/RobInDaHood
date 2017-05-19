# RobInDaHood
A desktop app for Robinhood

![robindahood](http://i.imgur.com/UYlM9FL.png)

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

Project setup: https://medium.freecodecamp.com/building-an-electron-application-with-create-react-app-97945861647c#.pf5yr1mgt

API reference: https://github.com/sanko/Robinhood

## How to Run
```shell
npm install
npm run dev
```

## Build
```shell
npm run build
npm run dist
```

## Todos
- [ ] https://github.com/electron-userland/electron-builder/wiki/Auto-Update
- [ ] https://github.com/ameyms/react-animated-number
- [ ] portfolio chart: adjusted_close_equity vs adjusted_open_equity *****
- [ ] extended_hours order
- [ ] Dividends related
- [ ] Markets related
- [ ] refactor the code
- [ ] RH Gold related
- [x] own toFixed(2) => if smaller than 1, show all digit
- [ ] order: ITEK is part of the SEC's Tick Size Pilot Program. Because of this, you can only place orders in increments of $0.05. Please update to the newest version of Robinhood to make market orders for ITEK.
