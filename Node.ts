
type half_byte=0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15;
type fcallback=(node:Node,value:half_byte)=>void;
interface NodeValue{
    value:number;
    node:Node;
};

export class Node
{
    value:half_byte= 0;
    node_dictionary:Node[] = [];
    counter:number = 0;
    is_marked:boolean = false;

    constructor(value:half_byte) 
    {
        this.node_dictionary = Node.buildDictionary();
        this.foreach((n,i)=>n.setNodeFor(i,this));
    }

    public getNode(value:half_byte):Node
    {
        if( this.node_dictionary.length == 0 )
            throw new Exception('Error dictionary is empty');

        return this.node_dictionary.find(n=>n.value == value) as Node;
    }

    public unmark()
    {
        if( !this.is_marked)
            return;

        this.is_marked = false;

        for(let z in this.node_dictionary)
        {
            z.unMark();
        }
    }
    public resetCounters()
    {
        if( this.is_marked )
            return;

        this.is_marked = true;
        
        this.counter = 0;

        for(let z in this.node_dictionary)
            z.resetCounters(data);
    }

    public sumCounter(data:number[]):void
    {
        if( this.is_marked )
            return;

        this.is_marked = true;
        
        data[this.value]+= this.counter; 
        for(let z in this.node_dictionary)
            z.sumCounter(data);
    }

    public addCounter(data:number[])
    {
        if( this.is_marked )
            return;

        this.is_marked = true;
        
        data.push( this.counter );

        for(let z in this.node_dictionary)
            z.addCounter(data);
    }

    compare(node:Node)
    {
        return node.counter > this.counter ? 1 : -1;
    }

    public sortPositions()
    {
        if( this.is_marked )
            return;

        this.node_dictionary.sort((n1,n2)=>n1.compare(n2));
        
        for(let z in this.node_dictionary)
        {
            z.sortPositions();
        }
    }


    public analyze(value:half_byte){
        this.counter++;
        return {
            value: this.value,
            node: this.node_dictionary[value]
        }
    }

    public process():half_byte
    {
        return this.value;
    }

    public getNextNodeAnValue(value:half_byte):NodeValue
    {
        let node = this.node_dictionary[value];
        return { node: node, value: this.value }
    }

    setNodeFor(value:half_byte,node:Node):void
    {
        this.node_dictionary[value] = node;   
    }

    foreach(f:fcallback):void
    {
        this.node_dictionary.forEach(f);
    }

    static buildDictionary():Node[]
    {
        let n:Node[] = new Array(16);
        for(let i=0;i<16;i++)
        {
            n[i] = new Node(i);
        }
        return n;
    }
    //1+16 =  17*49 = 833 bytes dictionary
    static build16Plus256():Node[]
    {
        let n:Node[] = Node.buildDictionary();
        n.forEach((node,j)=>
        {
            let d = Node.buildDictionary();
            node.foreach((n2,j)=>{
                n2.setNodeFor(j,d[j]);
                d[j].foreach((n3,k)=>{
                    n3.setNodeFor(k,n[k]);
                })
            })
        })

        for(let i=0;i<16;i++)
        {
            n[i] = new Node(i);
            n[i].foreach((node,j)=>{
                let d = Node.buildDictionary();
                node.foreach((n2,j)=>{
                    n2.setNodeFor(j,d[j]);
                    d[j].foreach((n3,k)=>{
                        n3.setNodeFor(k,n[k]);
                    })
                })
            })
        }
       return n;
    }
    // 16+16) * 49 = 1568 bytes dictionary
    // 16+16*16
    static build16Plus16():Node[]
    {
        let d1 = Node.buildDictionary();
        let d2 = Node.buildDictionary();

        d1.forEach((n,i)=>n.setNodeFor(i,d2[i]));
        d2.forEach((n,i)=>n.setNodeFor(i,d1[i]));
        return d1;
    }

    static build16P16X4():Node[][]
    {
        let d1 = Node.buildDictionary();
        let d2 = Node.buildDictionary();
        let d3 = Node.buildDictionary();
        let d4 = Node.buildDictionary();

        d1.forEach((n,i)=>n.setNodeFor(i,d2[i]));
        d2.forEach((n,i)=>n.setNodeFor(i,d3[i]));
        d3.forEach((n,i)=>n.setNodeFor(i,d4[i]));
        d4.forEach((n,i)=>n.setNodeFor(i,d1[i]));
        return [d1,d2,d3,d4];
    }

    static build16PxN(l):Node[][]
    {
        let levels:Node[][] = [];
        let d1 = Node.buildDictionary();

        for(let i=0;i<levels;i++)
        {
            levels[i] = Node.buildDictionary();
        }

        for(let i=0;i<levels;i++)
        {
            levels[i].forEach((n,index)=>{
                if( i<l-1 )
                {
                    n.setNodeFor(index,levels[i+1])
                }
                else
                {
                    n.setNodeFor(index,levels[0]);
                }
            })
        }

        return levels;
    }

    static build16Plus256():Node[]
    {
        let d1 = Node.buildDictionary();
        for(let n of d1)
        {
            let d2 = Node.buildDictionary();
            let hb = 0;
            for(let nn of d2)
            {
                n.setNodeFor(nn.value,nn);
                let d3 = Node.buildDictionary();
                for(let nnn of d3)
                {
                    nn.setNodeFor(nnn.value,nnn);
                    for(let fn of d1)
                    {
                        nnn.setNodeFor(fn.value,d1[fn.value]);
                    }
               }
            }
        }
        return d1;
    }

    static build16Plus16():Node[]
    {
        let d1 = Node.buildDictionary();
        let d2 = Node.buildDictionary();
        let d3 = Node.buildDictionary();
        let d4 = Node.buildDictionary();

        d1.forEach((n,i)=>n.setNodeFor(i,d2[i]));
        d2.forEach((n,i)=>n.setNodeFor(i,d1[i]));

    }
    static build16Plus32()
    {
        let d1 = Node.buildDictionary();
        let d2 = Node.buildDictionary();
        let d3 = Node.buildDictionary();
        
        d1.forEach((node,half_byte)=>{            
            node.setNodeFor(half_byte,half_byte<8?d2[half_byte]:d3[half_byte]);
        })
    }


    //Interesting next schema
    //its a triangle
    /*
        d1->d2
        d2->d3
        d3->d1
        d1->dd1
        d2->dd2
        d3->dd3
        dd1->dd2
        dd2->dd3
        dd3->dd1
        dd1->d3
        dd2->d1
        dd3->d2
    */
}

function compress(node, data:Uint8Array[])
{
    let current = node;
    let u_data = new Uint8Array(data.length);
    let fh:number = 0;
    let sh:number = 0;

    let index = 0;
    for(let d in data)
    {
        fh = d >> 4;
        sh = d & 0x0f;

        let x = current.getNextNodeAnValue(fh)
        current = x.node;
        let y  = current.getNextNodeAnValue(sh);
        current = y.node;
        fh = x.value << 4;
        nData[index++] = fh | y.value;
    }
    return u_data;
 }

function uncompress(node, data:Uint8Array[])
{
    let current = node;
    let u_data = new Uint8Array(data.length);
    let fh:number = 0;
    let sh:number = 0;

    let index = 0;
    for(let d in data)
    {
        fh = d >> 4;
        sh = d & 0x0f;

        let x = current.getNextNodeAnValue(fh)
        current = x.node;
        let y  = current.getNextNodeAnValue(sh);
        current = y.node;
        fh = x.value << 4;
        nData[index++] = fh | y.value;
    }
    return u_data;
 }

 function analyze(node:Node, data:Uint8Array)
 {
    let current = node;
    let fh:number = 0;
    let sh:number = 0;

    let index = 0;
    for(let d in data)
    {
        fh = d >> 4;
        sh = d & 0x0f;

        let x = current.analyze(fh)
        current = x.node;
        let y  = current.analyze(sh);
        current = y.node;
    }
    return u_data;
 }


 function main_alg(data:Uint8Array)
 {
    let d = Node.build16PxN(17)
    let f_node =d[0][0];

    analyze(f_node,data);
    let counters = new Array(16);
    counters.fill(0);
    f_node.sumCounter(counters);
    f_node.unmark();
    let d:number[] = [];
    f_node.addCounter(d);
    console.log( d );
    f_node.unmark();
    f_node.sortPositions();
    let d = compress(f_node,data);

    let dd = new Array(256);
    dd.fill(0);
    for(let x of d)
    {
        dd[x]++;
    }
    dd.sort();
    console.log('Byte counter',dd); 
 }