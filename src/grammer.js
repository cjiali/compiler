/********************************
delimiters: [' ', '@', '(', ')', '[', ']', '{', '}', '#', '!', '^', '_', '',]

<Preset>: (<PresetProperty>)
<Select>: [<SelectedContent>]
<Block>: {<BlockContent>}
<Class>: @(<ClassList>), such as `@(classA classB)
<Attribute>: @[<AttributeMap>], such as `@[.class, #id, =100%*100%, title="A Title"]`
<Style>: @{<StyleSheet>}, such as `@{width: 100%;}`

#div @(classA classB classC) @[title=Hello World, id=level1] @{
    width: 100%;
    height: 100%;
}{
    #div @(classA classB classC) @[title=Hello World, id=level1] @{
        width: 100%;
        height: 100%;
    }{
        #image @[src=image.jgp =100*100px]
    }
}

#div@[#id, .class, =100*100px, title=Title Text]{
    #image@[src=image.jgp =100*100px]
}@(classA classB classC)

%1@[#h1]heading with level one
%2@[#h2]heading with level two

#[alt](src title)
![alt](src title)
^[sub]
_[sup]
[^footnote]

************************************/
