
export var pegCMake:string;
interface Position {
    offset: Number;
    line: Number;
    column: Number;
}
interface Location {
    start: Position;
    end: Position;
}
interface ASTNode {
    location: Location;
    type: string;
}

export    function parse(data:string):ASTNode[];
export    function format(data:string):string;

export default pegCMake;