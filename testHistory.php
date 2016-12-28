<!DOCTYPE html>    
<head>
    <meta charset="utf-8">
    <title>New Demo</title>
	<script src="js/jquery-1.8.3.min.js" ></script>
	<script src="https://rawgit.com/ArthurClemens/Javascript-Undo-Manager/master/lib/undomanager.js"></script>
 </head>
<body>


<script type="text/javascript">
jQuery(document).ready(function(){
var undoManager = new UndoManager(),
    people = {},
    addPerson,
    removePerson,
    createPerson;        

addPerson = function(id, name) {
    people[id] = name;
};

removePerson = function(id) {
    delete people[id];
};

createPerson = function (id, name) {
    // first creation
    addPerson(id, name);

    // make undo-able
    undoManager.add({
        undo: function() {
            removePerson(id)
        },
        redo: function() {
            addPerson(id, name);
        }
    });
}

createPerson(101, "John");
createPerson(102, "Mary");

console.log("people", people); // {101: "John", 102: "Mary"}

undoManager.undo();
console.log("people", people); // {101: "John"}

undoManager.undo();
console.log("people", people); // {}

undoManager.redo();
console.log("people", people); // {101: "John"}

});
</script>
</body>