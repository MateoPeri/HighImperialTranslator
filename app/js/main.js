define(function (require, exports, module) {
    var Context = require('samsara/dom/Context');
    var View = require('samsara/core/View');
    var Transform = require('samsara/core/Transform');
    var Surface = require('samsara/dom/Surface');
    var ContainerSurface = require('samsara/dom/ContainerSurface');
    var nlp=require('./nlp_compromise');

    function translate(text)
    {
        var terms=nlp.text(text).terms();
        var subject=(terms[0].tag=='Person'||terms[0].tag=='Noun')&&terms[0].normal!='i'?terms[0].text:'';
        var verb=null;
        var tensePhrase='';
        var theRest='';

        for (var i = 0; i < terms.length; i++) {
            var term = terms[i];
            if(verb!=null)
            {
                theRest+=' '+term.text;
            }
            if(term.pos.Verb&&verb==null)
            {
                verb=term.text;
                tensePhrase=term.tag;
            }
            
        }
        console.log(verb);
        console.log(nlp.verb(verb).root());
        verb=nlp.verb(verb).root()+'ing';
        
        switch(tensePhrase)
        {
            case 'PastTense':
                tensePhrase='Wasing ';
                break;
            case 'Infinitive':
                tensePhrase='Ising ';
                break;
            case 'FutureTense':
                tensePhrase='Willing ';
                break;
        }
        if(subject!='')
        {
            subject=' of the '+subject;
        }
        verb=' of the '+verb;
        return tensePhrase+subject+verb+theRest;
    }

    var headerHeight=100;
    var header=new Surface({
        size: ['100%',headerHeight],
        content: 'High Imperial Translator',
        properties: {
            textAlign:'center',
            verticalAlign:'middle',
            lineHeight:headerHeight+'px',
            fontSize:'40px'
        }
    });

    var highImperialSurface=new Surface({
        size: ['100%',headerHeight],
        origin: [0.5,0.5],
        properties: {
            textAlign:'center',
            verticalAlign:'baseline',
            fontSize:'30px'
        }
    });

    var textBox=document.createElement('input');
    textBox.inputType='text';
    textBox.setAttribute('style','width: 100%');
    var textBoxSurface=new Surface({
        size: [300,30],
        origin: [0.5,0.5],
        content: textBox
    });

    var translateButton=new Surface({
        size: [200,50],
        origin: [0.5,0.5],
        content: 'Ising of the translating!',
        properties: {
            textAlign:'center',
            verticalAlign:'middle',
            lineHeight:50+'px',
            fontSize:'20px',
            background:'white',
            borderRadius:'20px'
        }
    });
    translateButton.on('click',function(){
        var english=textBox.value;
        console.log(nlp.text(english).terms());
        highImperialSurface.setContent(translate(english));
    });

    // Create a Samsara Context as the root of the render tree
    var context = new Context();

    context
        .add(header);

    context
        .add({align:[0.5,0.5]})
        .add({transform:Transform.translate([0,-40])})
        .add(highImperialSurface);
    context
        .add({align:[0.5,0.5]})
        .add({transform:Transform.translate([0,0])})
        .add(textBoxSurface);

    context
        .add({align:[0.5,0.5]})
        .add({transform:Transform.translate([0,50])})
        .add(translateButton);

    // Mount the context to a DOM element
    context.mount(document.body);
});