window.MathJax = {
    tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
        processEscapes: true,
        tags: 'ams'
    },
    svg: {
        fontCache: 'global',
        scale: 1.1
    },
    chtml: {
        scale: 0.9,
        minScale: 0.5,
        mtextInheritFont: true
    },
    options: {
        renderActions: {
            addMenu: []
        },
        menuOptions: {
            settings: {
                zoom: 'Click',
                zscale: '200%'
            }
        }
    },
    loader: {
        load: ['[tex]/ams', '[tex]/color', '[tex]/noerrors', '[tex]/noundefined', '[tex]/boldsymbol']
    }
};