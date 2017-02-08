# Fast Framework system

If you want to create fast prototype of project, this framework is suitable for you. Fast start. Ease and famous tools and concepts help you create simple project. I don't think that this decision suite to production, use it only for prototyping.

###Start on localhost:

```
npm install
npm run start
```

###Start on windows:

```
npm install
npm run server
gulp #in another terminal's tab
```

###Start on server:

```
npm install
gulp build
npm run server
```

###Problems

If you will see error `Error: listen EADDRINUSE :::4422`, it is mean that port 4422 is busy, run command `ps`, see what pid runing on port and run `kill <PID>`;

###DOCS

[here](http://fast-framework.dihar.me/)

###BUILD

```
//on local host
docker build -t kanaglic/fast-framework

docker login //you must be authenticated to docker hub and have write acces to this repo

docker push kanaglic/fast-framework .

...

//on server
docker pull kanaglic/fast-framework

docker stop fast-framework
docker rm fast-framework
docker run -p 80:4422 --name fast-framework -d kanaglic/fast-framework
```
