import { gql } from '@apollo/client';

export const ADD_INVOICE = gql`
    mutation AddInvoice($invoice: InvoiceInput!) {
        addInvoice(invoice: $invoice) {
            invoiceNo
        }
    }
`;
