FROM node:argon

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app
RUN npm install
RUN ./node_modules/gulp/bin/gulp.js build

EXPOSE 4422

CMD [ "npm", "run", "server" ]
