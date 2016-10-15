# Fast Framework system 

###Start on localhost:

`npm install`
`bower install`
`npm run start`

###Start on server:

`npm install`
`bower install`
`gulp build`
`npm start server`


###Description: 

Основные части проекта: точка входа index.html, шаблонизатор Mustache, роутер jquery-router-plugin. При загрузке на любую страницу роутер обрабатывает строку и редиректит на нужную страницу. Далее привязываем к роутеру контроллер, заранее объявив его `ff.controller.set('name', function(){/** Действия контроллера */}, function(){ /** Функция чистки контроллера */})` (не забываем все файлы добавлять в ресурсы для склейки в gulpfile.js). В контроллере подгружаем необходимый шаблон и инсертим его с уже готовыми данными, пример для индекса: 

```
    ff.controller.set('index', function(){
        $.get('views/index.mst', function(template){
        ff.view('index', function(template){
                ('#mustache-target').html(rendered);
            }, {name: 'Hello world'})            
        });
    });

    ff.router.add('/', ff.controller.get('index'), 'Default title');

    $('#button').click(function(){
        ff.router.go('/')
        });
```

View.js expand ff namespace, simple get views with Mustache

    @function ff.view(name, callback, data)
        * @param name
            name of view (must equal file name in views folder without extention)
        * @param callback
            callback succsess function with one parameter: template (template or mustache rendering)
        * @param data
            if you want mustache rendered template, set obj, without it, result will be template as it is on server;
        * @return jQuery Deferrer

Route.js turn jquery-router-plugin.js. In global namespace ff

    ff.route.add(name, controller, title)
        * @param name 
            name of route must be equal link (like /hello-world/hi)
        * @param controller 
            controller callback
        * 
