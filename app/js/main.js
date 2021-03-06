define(function (require, exports, module) {
    var Context = require('samsara/dom/Context');
    var View = require('samsara/core/View');
    var Transform = require('samsara/core/Transform');
    var Transitionable = require('samsara/core/Transitionable');
    var Surface = require('samsara/dom/Surface');
    var ContainerSurface = require('samsara/dom/ContainerSurface');
    var HeaderFooterLayout = require('samsara/layouts/HeaderFooterLayout');
    var translate = require('./translation');

    // Create a Samsara Context as the root of the render tree
    var context = new Context();

    var headerHeight=100;
    var footerHeight=150;
    var headerOpacity=new Transitionable(0);
    var header=new Surface({
        size: [undefined,headerHeight],
        content: 'HIGH IMPERIAL TRANSLATOR',
        opacity: headerOpacity,
        properties: {
            textAlign:'center',
            verticalAlign:'middle',
            lineHeight:headerHeight+'px',
            fontSize:'60px',
            paddingRight:'30px',
            paddingLeft:'30px'
        }
    });
    var facebookDiv=document.getElementsByClassName('fb-like')[0];
    var facebookSurface=new Surface({
        size: [120,20],
        origin: [1,0.5],
        content: facebookDiv,
        opacity: headerOpacity
    });

    var content=new View();

    var highImperialOpacity=new Transitionable(0);
    var highImperialSurface=new Surface({
        size: [undefined,headerHeight],
        origin: [0.5,0.5],
        content: 'Ising of the be the result',
        opacity: highImperialOpacity,
        properties: {
            textAlign:'center',
            verticalAlign:'baseline',
            fontSize:'50px',
            paddingRight:'40px',
            paddingLeft:'40px'
        }
    });
    content
        .add({align:[0.5,0.25]})
        .add(highImperialSurface);

    function triggerTranslation(){
        highImperialOpacity.set(0, {duration : 500, curve : 'easeIn'},function(){
            var english=textBox.value;
            highImperialSurface.setContent(translate(english));
            highImperialOpacity.set(1, {duration : 500, curve : 'easeIn'});
        });
    }

    var textBoxOpacity=new Transitionable(0);
    var textBox=document.createElement('input');
    textBox.inputType='text';
    textBox.setAttribute('style','width: 100%; height: 100%');
    var textBoxSurface=new Surface({
        size: [300,30],
        origin: [0.5,0.5],
        content: textBox,
        opacity: textBoxOpacity
    });
    textBox.onkeydown=function(e){
        if (e.keyCode==13) {
            triggerTranslation();
        }
    };
    content
        .add({align:[0.5,0.5]})
        .add({transform:Transform.translate([0,0])})
        .add(textBoxSurface);

    //var translateButtonOpacity=new Transitionable(0);
    var translateButton=new Surface({
        size: [250,50],
        origin: [0.5,0.5],
        content: 'Ising of the translating!',
        opacity: textBoxOpacity,
        properties: {
            textAlign:'center',
            verticalAlign:'middle',
            lineHeight:50+'px',
            fontSize:'20px',
            background:'white',
            borderRadius:'20px'
        }
    });
    translateButton.on('click',triggerTranslation);
    content
        .add({align:[0.5,0.5]})
        .add({transform:Transform.translate([0,50])})
        .add(translateButton);

    var footerFontSize=15;
    //var footer=new View();
    var details=[
        'By Richard Kopelow<br>',
        'This is super Alpha, needs much polish<br>',
        'NLP done with <a href="https://github.com/nlp-compromise/nlp_compromise">nlp_compromise</a><br>',
        'Layout powered by <a href="http://samsarajs.org/">SamsaraJS</a><br>',
        'Base project generated with <a href="https://github.com/richardkopelow/generator-samsara">generator-samsara</a><br>',
        'This is a fan made site, if you haven\'t read Mistborn by Brandon Sanderson you should'
    ];
    var detailTransitions=[];
    for (var i = 0; i < details.length; i++) {
        var element = details[i];
        detailTransitions[i]=new Transitionable(0);//((details.length-i)*footerFontSize);
        var elementSurface=new Surface({
            size: [undefined,footerFontSize+2],
            origin: [1,0],
            content: details[i],
            properties: {
                textAlign: 'right',
                verticalAlign: 'middle',
                lineHeight: footerFontSize+2+'px',
                fontSize: footerFontSize+'px',
                paddingRight: '30px'
            }
        });
        context
            .add({
                align: [1,1],
                transform: detailTransitions[i].map(function (index){return function(y){ //I know this is gross, I don't know how else I dhould deal with this
                    return Transform.translateY(index*footerFontSize-y);
                };}(i))
            })
            .add(elementSurface);
    }
    /*
    var footer=new Surface({
        size: [undefined,footerHeight],
        properties: {
            textAlign:'right',
            fontSize:'15px',
            paddingBottom:'30px',
            paddingRight:'30px'
        }
    });
    */

    var layout = new HeaderFooterLayout({
        header: header,
        //footer: footer,
        content: content
    });

    //Fade in
    headerOpacity.set(1, {duration : 1000, curve : 'easeIn'},function(){
        textBoxOpacity.set(1, {duration : 1000, curve : 'easeIn'},function(){
            highImperialOpacity.set(1, {duration : 1000, curve : 'easeIn'},function(){
                for (var i = 0; i < detailTransitions.length; i++) {
                    detailTransitions[i].set(120,{duration : 1000+500*i, curve : 'easeOutCubic'});
                }
            });
        });
    });

    context
        .add(layout);
    
    context
        .add({
            align:[1,0],
            transform: Transform.translate([0,headerHeight/2,0])
        })
        .add(facebookSurface);

    
    // Mount the context to a DOM element
    context.mount(document.body);
});
