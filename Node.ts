
type half_byte=0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15;
type fcallback=(node:Node,value:half_byte)=>void;
export class Node
{
    value:half_byte= 0;
    node_dictionary:Node[] = [];
    counter:number = 0;

    constructor(value:half_byte) 
    {
        this.node_dictionary = Node.buildDictionary();
        this.foreach((n,i)=>n.setNodeFor(i,this));
    }

    public getNode(value:half_byte){
        if( this.node_dictionary.length == 0 )
            throw new Exception('Error dictionary is empty');

        return this.node_dictionary.find(n=>n.value == value) as Node;
    }

    setNodeFor(value:half_byte,node:Node)
    {
        this.node_dictionary[value] = node;   
    }
    foreach(f:fcallback)
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