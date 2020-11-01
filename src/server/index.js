const { ApolloServer, gql } = require("apollo-server");
let firebase = require("firebase/app");
require("firebase/firestore");
const firebaseConfig = require("./config");

firebase.initializeApp(firebaseConfig);
let invoiceRef = firebase.firestore().collection("invoices");
let statsRef = firebase.firestore().collection("stats");

const typeDefs = gql`
  type Invoice {
    invoiceNo: Int!
    docNo: Int!
    docDate: String!
    netDueDate: String!
    amount: Int!
    postingDate: String!
    type: String!
    vendorCode: String!
    vendorName: String
    vendorType: String!
  }

  type Query {
    getAllInvoiceIds: [Int!]
    getTotalAmount: Int!
    getTotalInvoiceCount: Int!
  }

  type Mutation {
    addInvoice(invoice: InvoiceInput!): Invoice!
    uploadSingleFile(file: Upload!): Int!
  }

  input InvoiceInput {
    invoiceNo: Int!
    docNo: Int!
    docDate: String!
    netDueDate: String!
    amount: Int!
    postingDate: String!
    type: String!
    vendorCode: String!
    vendorName: String
    vendorType: String!
  }
`;

const resolvers = {
  Query: {
    getAllInvoiceIds: async () => {
      const snapshot = await statsRef.get();
      let data = [];
      await snapshot.forEach((doc) => {
        if (doc.data() !== null) data.push(doc.data());
      });
      return data[0]["AllInvoices"];
    },
    getTotalAmount: async () => {
      const snapshot = await statsRef.get();
      let data = [];
      await snapshot.forEach((doc) => {
        if (doc.data() !== null) data.push(doc.data());
      });
      return data[0]["TotalSum"];
    },
    getTotalInvoiceCount: async () => {
      const snapshot = await statsRef.get();
      let data = [];
      await snapshot.forEach((doc) => {
        if (doc.data() !== null) data.push(doc.data());
      });
      return data[0]["TotalInvoices"];
    },
  },
  Mutation: {
    addInvoice: async (parent, args) => {
      const invoice = {
        invoiceNo: args.invoice.invoiceNo,
        docNo: args.invoice.docNo,
        docDate: args.invoice.docDate,
        netDueDate: args.invoice.netDueDate,
        amount: args.invoice.amount,
        postingDate: args.invoice.postingDate,
        type: args.invoice.type,
        vendorCode: args.invoice.vendorCode,
        vendorName: args.invoice.vendorName,
        vendorType: args.invoice.vendorType,
      };
      invoiceRef.add(invoice);

      const snapshot = await statsRef.get();
      let data;
      await snapshot.forEach((doc) => {
        if (doc.data() !== null) data = doc.data();
      });

      data.AllInvoices.push(args.invoice.invoiceNo);

      const stats = {
        AllInvoices: data.AllInvoices,
        TotalInvoices: data.TotalInvoices + 1,
        TotalSum: data.TotalSum + args.invoice.amount,
      };
      statsRef.doc("ajVn9xsO3IeZzd7eKRea").update(stats);

      return invoice;
    },
  },
};
// ApolloServer constructor
const server = new ApolloServer({ typeDefs, resolvers });

// Launch the server
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
