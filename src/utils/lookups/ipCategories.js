/*
	This array, `ipCategories`, defines a list of special IPv6 address categories.
	Each object in the array contains:
	- `usage`: A description of the category or purpose of the IPv6 address range.
	- `cidr`: The CIDR notation representing the address range for the category.

	The categories include reserved addresses for various purposes, such as loopback addresses,
	IPv4-mapped addresses, and addresses used for specific protocols or reserved for future use.

	List for reference: https://en.wikipedia.org/wiki/IPv6_address#Local_addresses
*/

export const ipCategories = [
	{
		usage: 'Unspecified',
		cidr: '::/128',
	},
	{
		usage: 'Loopback',
		cidr: '::1/128',
	},
	{
		usage: 'IPv4-mapped',
		cidr: '::ffff:0:0/96',
	},
	{
		usage: 'IPv4-translated',
		cidr: '::ffff:0:0:0/96',
	},
	{
		usage: 'IPv4/IPv6 translation',
		cidr: '64:ff9b::/96',
	},
	{
		usage: 'IPv4/IPv6 translation',
		cidr: '64:ff9b:1::/48',
	},
	{
		usage: 'Discard prefix',
		cidr: '100::/64',
	},
	{
		usage: 'Teredo',
		cidr: '2001::/32',
	},
	{
		usage: 'ORCHIDv2',
		cidr: '2001:20::/28',
	},
	{
		usage: 'Used in documentation examples',
		cidr: '2001:db8::/32',
	},
	{
		usage: '6to4',
		cidr: '2002::/16',
	},
	{
		usage: 'Used in documentation examples',
		cidr: '3fff::/20',
	},
	{
		usage: 'IPv6 Segment Routing',
		cidr: '5f00::/16',
	},
	{
		usage: 'Used in documentation examples',
		cidr: 'fc00::/7',
	},
	{
		usage: 'Link-local address',
		cidr: 'fe80::/10',
	},
	{
		usage: 'Multicast address',
		cidr: 'ff00::/8',
	},
]

// export const ipCategories = [
// 	{
// 		usage: 'Unspecified',
// 		cidr: '::/128',
// 		firstAddress: '::',
// 		lastAddress: '::',
// 	},
// 	{
// 		usage: 'Loopback',
// 		cidr: '::1/128',
// 		firstAddress: '::1',
// 		lastAddress: '::1',
// 	},
// 	{
// 		usage: 'IPv4-mapped',
// 		cidr: '::ffff:0:0/96',
// 		firstAddress: '::ffff:0:0',
// 		lastAddress: '::ffff:ffff:ffff',
// 	},
// 	{
// 		usage: 'IPv4-translated',
// 		cidr: '::ffff:0:0:0/96',
// 		firstAddress: '::ffff:0:0:0',
// 		lastAddress: '::ffff:ffff:ffff:ffff',
// 	},
// 	{
// 		usage: 'IPv4/IPv6 translation',
// 		cidr: '64:ff9b::/96',
// 		firstAddress: '64:ff9b::',
// 		lastAddress: '64:ff9b::ffff:ffff',
// 	},
// 	{
// 		usage: 'IPv4/IPv6 translation',
// 		cidr: '64:ff9b:1::/48',
// 		firstAddress: '64:ff9b:1::',
// 		lastAddress: '64:ff9b:1:ffff:ffff:ffff:ffff:ffff',
// 	},
// 	{
// 		usage: 'Discard prefix',
// 		cidr: '100::/64',
// 		firstAddress: '100::',
// 		lastAddress: '100::ffff:ffff:ffff:ffff',
// 	},
// 	{
// 		usage: 'Teredo',
// 		cidr: '2001::/32',
// 		firstAddress: '2001::',
// 		lastAddress: '2001:ffff:ffff:ffff:ffff:ffff:ffff:ffff',
// 	},
// 	{
// 		usage: 'ORCHIDv2',
// 		cidr: '2001:20::/28',
// 		firstAddress: '2001:20::',
// 		lastAddress: '2001:2f:ffff:ffff:ffff:ffff:ffff:ffff',
// 	},
// 	{
// 		usage: 'Used in documentation examples',
// 		cidr: '2001:db8::/32',
// 		firstAddress: '2001:db8::',
// 		lastAddress: '2001:db8:ffff:ffff:ffff:ffff:ffff:ffff',
// 	},
// 	{
// 		usage: '6to4',
// 		cidr: '2002::/16',
// 		firstAddress: '2002::',
// 		lastAddress: '2002:ffff:ffff:ffff:ffff:ffff:ffff:ffff',
// 	},
// 	{
// 		usage: 'Used in documentation examples',
// 		cidr: '3fff::/20',
// 		firstAddress: '3fff::',
// 		lastAddress: '3fff:ffff:ffff:ffff:ffff:ffff:ffff:ffff',
// 	},
// 	{
// 		usage: 'IPv6 Segment Routing',
// 		cidr: '5f00::/16',
// 		firstAddress: '5f00::',
// 		lastAddress: '5f00:ffff:ffff:ffff:ffff:ffff:ffff:ffff',
// 	},
// 	{
// 		usage: 'Used in documentation examples',
// 		cidr: 'fc00::/7',
// 		firstAddress: 'fc00::',
// 		lastAddress: 'fdff:ffff:ffff:ffff:ffff:ffff:ffff:ffff',
// 	},
// 	{
// 		usage: 'Link-local address',
// 		cidr: 'fe80::/10',
// 		firstAddress: 'fe80::',
// 		lastAddress: 'febf:ffff:ffff:ffff:ffff:ffff:ffff:ffff',
// 	},
// 	{
// 		usage: 'Multicast address',
// 		cidr: 'ff00::/8',
// 		firstAddress: 'ff00::',
// 		lastAddress: 'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff',
// 	},
// ];
