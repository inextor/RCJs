
type half_byte=0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15;
type fcallback=(node:CNode,value:half_byte)=>void;
interface CNodeValue{
	value:number;
	node:CNode;
};

class CNode
{
	value:number= 0;
	node_dictionary:CNode[] = [];
	counter:number = 0;
	is_marked:boolean = false;
	name:string;

	constructor(value:number)
	{
		this.value =  value;
		this.node_dictionary = new Array(16);
		this.node_dictionary.fill( this );
	}

	public getCNode(value:number):CNode
	{
		if( this.node_dictionary.length == 0 )
			throw 'Error dictionary is empty';

		return this.node_dictionary.find(n=>n.value == value) as CNode;
	}

	public unmark()
	{
		if( !this.is_marked)
			return;

		this.is_marked = false;

		for(let z of this.node_dictionary)
		{
			z.unmark();
		}
	}
	public resetCounters()
	{
		if( this.is_marked )
			return;

		this.is_marked = true;

		this.counter = 0;

		for(let z of this.node_dictionary)
			z.resetCounters();
	}

	public sumCounter(data:number[]):void
	{
		if( this.is_marked )
			return;

		this.is_marked = true;

		data[this.value]+= this.counter;
		for(let z of this.node_dictionary)
			z.sumCounter(data);
	}

	public addCounter(data:number[])
	{
		if( this.is_marked )
			return;

		this.is_marked = true;

		data.push( this.counter );

		for(let z of this.node_dictionary)
			z.addCounter(data);
	}

	compare(node:CNode)
	{
		return node.counter > this.counter ? 1 : -1;
	}

	public sortPositions()
	{
		this.node_dictionary.sort((n1,n2)=>n1.compare(n2));

		if( this.is_marked )
			return;

		this.is_marked = true;


		for(let z of this.node_dictionary)
		{
			z.sortPositions();
		}
	}

	public analyze(value:number){
		this.counter++;
		return {
			value: this.value,
			node: this.node_dictionary[value]
		}
	}

	public process():number
	{
		return this.value;
	}

	public compress(value:number)
	{
		let index = this.node_dictionary.findIndex(n=>n.value==value) as number;
		let node = this.node_dictionary[index];
		return { node: node, value: index }
	}

	public getNextCNodeAnValue(value:number):CNodeValue
	{
		let index = this.node_dictionary.findIndex(n=>n.value==value) as number;
		let node = this.node_dictionary[value];
		return { node: node, value: index }
	}

	setCNodeFor(value:number,node:CNode):void
	{
		this.node_dictionary[value] = node;
	}

	foreach(f:fcallback):void
	{
		this.node_dictionary.forEach(f);
	}

	static buildDictionary():CNode[]
	{
		let n:CNode[] = new Array(16);
		for(let i=0;i<16;i++)
		{
			n[i] = new CNode(i);
		}
		return n;
	}
	////1+16 = 17*49 = 833 bytes dictionary
	//static build16Plus256():CNode[]
	//{
	//	let n:CNode[] = CNode.buildDictionary();
	//	n.forEach((node,j)=>
	//	{
	//		let d = CNode.buildDictionary();
	//		node.foreach((n2,j)=>{
	//			n2.setCNodeFor(j,d[j]);
	//			d[j].foreach((n3,k)=>{
	//				n3.setCNodeFor(k,n[k]);
	//			})
	//		})
	//	})

	//	for(let i=0;i<16;i++)
	//	{
	//		n[i] = new CNode(i);
	//		n[i].foreach((node,j)=>{
	//			let d = CNode.buildDictionary();
	//			node.foreach((n2,j)=>{
	//				n2.setCNodeFor(j,d[j]);
	//				d[j].foreach((n3,k)=>{
	//					n3.setCNodeFor(k,n[k]);
	//				})
	//			})
	//		})
	//	}
	//	return n;
	//}
	// 16+16) * 49 = 1568 bytes dictionary
	// 16+16*16
	static build16Plus16():CNode[]
	{
		let d1 = CNode.buildDictionary();
		let d2 = CNode.buildDictionary();

		d1.forEach((n,i)=>n.setCNodeFor(i,d2[i]));
		d2.forEach((n,i)=>n.setCNodeFor(i,d1[i]));
		return d1;
	}

	static build16P16X4():CNode[][]
	{
		let d1 = CNode.buildDictionary();
		let d2 = CNode.buildDictionary();
		let d3 = CNode.buildDictionary();
		let d4 = CNode.buildDictionary();

		d1.forEach((n,i)=>n.setCNodeFor(i,d2[i]));
		d2.forEach((n,i)=>n.setCNodeFor(i,d3[i]));
		d3.forEach((n,i)=>n.setCNodeFor(i,d4[i]));
		d4.forEach((n,i)=>n.setCNodeFor(i,d1[i]));
		return [d1,d2,d3,d4];
	}

	static build16PxN(l:number):CNode[][]
	{
		let levels:CNode[][] = new Array(l);

		for(let i=0;i<levels.length;i++)
		{
			levels[i] = CNode.buildDictionary();
		}

		for(let i=0;i<levels.length;i++)
		{
			levels[i].forEach((n,index)=>{
				for(let kk=0;kk<16;kk++)
				{
					if( i<l-1 )
					{
						n.setCNodeFor(kk,levels[i+1][kk]);
					}
					else
					{
						n.setCNodeFor(kk,levels[0][kk]);
					}
				}
			})
		}

		return levels;
	}

	static build16Plus256():CNode[]
	{
		let d1 = CNode.buildDictionary();
		console.log('BUilding d1');

		for(let n of d1)
		{
			n.name = 'd1';
			let d2 = CNode.buildDictionary();
			console.log('BUilding d2');
			for(let nn of d2)
			{
				console.log('Setting for d1', nn.value, nn);
				n.setCNodeFor(nn.value,nn);
				nn.name = 'd2';
				let d3 = CNode.buildDictionary();
				//console.log('BUilding d3');
				for(let nnn of d3)
				{
					nnn.name = 'd3';
					nn.setCNodeFor(nnn.value,nnn);
					for(let fn of d1)
					{
						nnn.setCNodeFor(fn.value,fn);
					}
				}
			}
		}
		return d1;
	}

	//static build16Plus16():CNode[]
	//{
	//	let d1 = CNode.buildDictionary();
	//	let d2 = CNode.buildDictionary();
	//	let d3 = CNode.buildDictionary();
	//	let d4 = CNode.buildDictionary();

	//	d1.forEach((n,i)=>n.setCNodeFor(i,d2[i]));
	//	d2.forEach((n,i)=>n.setCNodeFor(i,d1[i]));

	//}
	//static build16Plus32()
	//{
	//	let d1 = CNode.buildDictionary();
	//	let d2 = CNode.buildDictionary();
	//	let d3 = CNode.buildDictionary();
	//
	//	d1.forEach((node,half_byte)=>{
	//		node.setCNodeFor(half_byte,half_byte<8?d2[half_byte]:d3[half_byte]);
	//	})
	//}


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

function compress(node:CNode, data:number[]):number[]
{
	let current = node;
	let u_data:number[] = new Array(data.length);
	let counter = new Array(16);
	counter.fill(0);

	let index = 0;

	let prev = 0;

	for(let d of data)
	{
		let diff = prev - d;
		if( diff < 0 )
			diff+=16;

		let x = current.compress(diff)
		current = x.node;
                counter[ x.value ]++;
		u_data[index++] = x.value;
		prev = d;
	}
	return counter;
 }

//function uncompress(node:CNode, data:number[])
//{
//	let current = node;
//	let u_data = new Uint8Array(data.length);
//	let fh:number = 0;
//	let sh:number = 0;
//
//	let index = 0;
//	for(let d of data)
//	{
//		fh = d >> 4;
//		sh = d & 0x0f;
//
//		let x = current.getNextCNodeAnValue(fh )
//		current = x.node;
//		u_data[index++] =
//	}
//	return u_data;
// }

 function analyze(node:CNode, data:number[])
 {
	let current = node;
	let fh:number = 0;
	let sh:number = 0;
	let prev = 0;

	for(let d of data)
	{
		let diff = prev - d;
		if( diff < 0 )
			diff += 16;

		let x = current.analyze( diff )
		current = x.node;
		prev = d;
	}
 }


 function main_alg(data:Uint8Array | number[])
 {
	let d = CNode.build16Plus256();
	//let zz = CNode.build16PxN(2);

	//let f_node =zz[0][0];
	let f_node =d[0];

	console.log('First', f_node );


	let halfs:number[] = [];
	data.forEach((i:number)=>{
		halfs.push( i>>4, i&15);
	});

	analyze(f_node,halfs);
	f_node.sortPositions();
	//d.sort((a,b)=>{
	//	return a.compare(b);
	//});




	let compressed = compress(f_node,halfs);

	let counters = new Array(16);
	counters.fill(0);
	f_node.unmark();
	f_node.sumCounter(counters);
	f_node.unmark();
	console.log('Sum counters', counters );

	f_node.unmark();
	let add_counter:number[] = [];
	f_node.addCounter(add_counter);
	console.log('Add counters', add_counter );
	f_node.unmark();

	console.log('Counters compressed', compressed );

	//let dd = new Array(256);
	//dd.fill(0);
	//for(let x of compressed)
	//{
	//	dd[x]++;
	//}
	//dd.sort();
	//console.log('Byte counter',dd);
	console.log('AN 256');
}
