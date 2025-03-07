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
		usage: {
			'c': 'Unspecified',
			'cs': 'Nespecifikováno'
		},
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
		usage: {
			'c': 'Used in documentation examples',
			'cs': 'Používáno v ukázkách v dokumentaci'
		},
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
		usage: {
			'c': 'Used in documentation examples',
			'cs': 'Používáno v ukázkách v dokumentaci'
		},
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
