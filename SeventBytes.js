class SevenBytes
{
	constructor(a_number_array)
	{
		this.array = [];

		let tmp_a = [];

		let i=0;
		for(i=0;i<a_number_array.length;i++)
		{
			tmp_a.push( a_number_array[i] );
			if( (i%7) == 0 && i != 7)
			{
				this.addNewNumber( tmp_a );
				tmp_a = [];
			}
		}

		if(tmp_a.length !== 0 )
		{
			for(let i=0;i<7-temp.length;i++)
			{
				tmp_a.push( 0 );
			}
			this.addNewNumber( tmp_a );
		}
	}

	addNewNumber(byte_array)
	{
		let b1 = byte_array[0]<<48;
		let b2 = byte_array[1]<<40;
		let b3 = byte_array[2]<<32;
		let b4 = byte_array[3]<<24;
		let b5 = byte_array[4]<<16;
		let b6 = byte_array[5]<<8;
		let b7 = byte_array[6];

		let n = b1|b2|b3|b4|b5|b6|b7;
		this.array.push( n );
	}

	toByteArray()
	{
		let tmp = [];
		let f1= 0x0000000000000000;
		let f2= 0x00FFFFFFFFFFFFFF;
		let f3= 0x0000FFFFFFFFFFFF;
		let f4= 0x000000FFFFFFFFFF;
		let f5= 0x00000000FFFFFFFF;
		let f6= 0x0000000000FFFFFF;
		let f7= 0x000000000000FFFF;
		let f8= 0x00000000000000FF;
		let biggest = f2;

		for(let n in this.numbers )
		{
			tmp.push( n>>48 );
			tmp.push( (n>>40)&f8 );
			tmp.push( (n>>32)&f8 );
			tmp.push( (n>>24)&f8 );
			tmp.push( (n>>16)&f8 );
			tmp.push( (n>>8)&f8 );
			tmp.push( (n)&f8 );
		}
		return tmp;
	}
}
