YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "YUI"
    ],
    "modules": [
        "gallery-debounce",
        "yui"
    ],
    "allModules": [
        {
            "displayName": "gallery-debounce",
            "name": "gallery-debounce",
            "description": "Debouncing is a similar strategy to throttling (see yui-throttle)\n\nY.debounce delays the execution of a function by a certain number\nof milliseconds, starting over every time the function is called.\nThat way it allows you to listen only once to events happening\nrepeated times over a time span.\n\nFor example, you can debounce a callback to a keypress event\nso that you know when the user stopped typing:\n```\nY.one('input').on('click', Y.debounce(500, function () {\n    alert('The user stopped typing');\n}));\n```"
        },
        {
            "displayName": "yui",
            "name": "yui"
        }
    ]
} };
});