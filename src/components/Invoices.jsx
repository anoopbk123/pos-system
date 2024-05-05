import React, { useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import CreateInvoice from "./CreateInvoice";

export default function Invoices() {
  const [invoices, setInvoices] = useState([ ]);
  const [showCreateInvoice, setShowCreateInvoice] = useState(false)
  const [searchInvoice, setSearchInvoice] = useState('')
  return (
    <div className="m-3">
      <h1 className="h5 text-light bg-danger p-1 m-0">Invoice</h1>
      <div className="d-flex flex-wrap bg-danger-subtle py-2 justify-content-between gap-3">
        <div>
          <Button variant="danger" onClick={()=>{
            setShowCreateInvoice(true)
          }}>Create</Button>
        </div>
        <div
          style={{ maxWidth: "400px" }}
          className="flex-grow-1 d-flex mx-sm-5 gap-1 gap-sm-3"
        >
          <Form.Control
          className="mx-1"
            type="text"
            placeholder="Search invoice by customer name"
            value={searchInvoice}
            onChange={(e)=>{
              setSearchInvoice(e.target.value)
            }}
          />
        </div>
      </div>
      {invoices.length ? (
        <Table className="my-1" hover responsive striped variant="danger">
          <thead>
            <tr>
              <th>Invoice No</th>
              <th>Date</th>
              <th>Customer Name</th>
              <th>Total</th>
              <th>Tax</th>
              <th>Grand Total</th>
            </tr>
          </thead>
          <tbody>
            {invoices.filter(invoice=>{
              if(searchInvoice){
                const search = searchInvoice.toLowerCase()
                const customerName = invoice.customerName.toLowerCase()
                return customerName.includes(search)
              }
              else{
                return true
              }
            }).map((invoice) => (
              <tr key={invoice.invoiceNo}>
                <td>{invoice.invoiceNo}</td>
                <td>{invoice.invoiceDate}</td>
                <td>{invoice.customerName}</td>
                <td>{invoice.total}</td>
                <td>{invoice.tax}</td>
                <td>{invoice.grandTotal}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="text-center m-4 fw-bold">No invoices</div>
      )}
      {
        showCreateInvoice&&<CreateInvoice setShowCreateInvoice={setShowCreateInvoice} invoices={invoices} setInvoices={setInvoices} />
      }
    </div>
  );
}
