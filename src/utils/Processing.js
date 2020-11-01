function SSFToDate(serial) {
   var utc_days  = Math.floor(serial - 25569);
   var utc_value = utc_days * 86400;                                        
   var date_info = new Date(utc_value * 1000);
   var fractional_day = serial - Math.floor(serial) + 0.0000001;
   var total_seconds = Math.floor(86400 * fractional_day);
   var seconds = total_seconds % 60;
   total_seconds -= seconds;
   return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate());
}

const processRows = (data) => {
    if(data) {
        let validEntries = new Set();
        let totalEntries = data.length;
        let totalAmount = 0;
        let vendors = new Set();
        let totalVendors = 0;
        let today = new Date()
        data =  data.map( row => ({
            invoiceNo: row["Invoice Numbers"],
            docNo: row["Document Number"],
            docDate: SSFToDate(row["Doc. Date"]),
            netDueDate: SSFToDate(row["Net due dt"]),
            amount: row["Amt in loc.cur."],
            postingDate: SSFToDate(row["Pstng Date"]),
            type: row["Type"],
            vendorCode: row["Vendor Code"],
            vendorName: row["Vendor name"],
            vendorType: row["Vendor type"]
        })).filter( row => row.docDate <= today && row.netDueDate > today );
        let totalValid = data.length;

        data = data.filter(row => {
            if(validEntries.has(row.invoiceNo)) {
                return false;
            } 
            validEntries.add(row.invoiceNo);
            vendors.add(row.vendorName);
            totalAmount += row.amount;
            row.docDate = row.docDate.toString()
            row.netDueDate = row.netDueDate.toString()
            row.postingDate = row.postingDate.toString()
            return true
        });
        totalVendors = vendors.size;
        let totalDuplicates = totalValid - data.length;
        
        let stats = {
            "Total Entries": totalEntries, 
            "Total Valid Entries": totalValid, 
            "Total Duplicates": totalDuplicates, 
            "Total Amount": totalAmount, 
            "Total Vendors": totalVendors
        }
        return [ data, stats];
    }
    return null
}


export default processRows;
