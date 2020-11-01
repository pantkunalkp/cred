const SheetJSFT = [
	'xlsx',
	'xlsb',
	'xlsm',
	'xls',
	'csv',
	'wb*',
	'wq*',
].map(x => '.' + x).join(',');

export default SheetJSFT