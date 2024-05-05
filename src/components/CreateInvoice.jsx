import React, { useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import productData from "../Assets/productData";
import { toast } from "react-toastify";

export default function CreateInvoice({
  invoices,
  setInvoices,
  setShowCreateInvoice,
}) {
  const date = new Date();
  const [invoiceFormData, setInvoiceFormData] = useState({
    invoiceNo: invoices.length + 1,
    invoiceDate: `${date.getDate()}-${
      date.getMonth() + 1
    }-${date.getFullYear()}`,
    customerName: "",
    productList: [],
  });
  const [searchProduct, setSearchProduct] = useState("");
  const [addedProducts, setAddedProducts] = useState([]);
  const handleInvoiceFormDataChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "text") {
      setInvoiceFormData((previousData) => {
        return {
          ...previousData,
          [name]: value,
        };
      });
    } else if (type === "checkbox") {
      // console.log(value, checked)
      if (checked) {
        setInvoiceFormData((previousData) => {
          return {
            ...previousData,
            productList: [...previousData.productList, value],
          };
        });
        // console.log(invoiceFormData);
      } else {
        setInvoiceFormData((previousData) => {
          return {
            ...previousData,
            productList: previousData.productList.filter(
              (item) => item !== value
            ),
          };
        });
        // console.log(invoiceFormData);
      }
    }
  };
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);
  const handleProductSave = () => {
    if (invoiceFormData.productList.length) {
      setShow(false);
      const selectedProducts = productData.filter((value) =>
        invoiceFormData.productList.includes(value.id)
      );
      // console.log(selectedProducts)
      const totalPrice = selectedProducts
        .reduce((sum, product) => {
          return sum + product.price;
        }, 0)
        .toFixed(2);
      // console.log(totalPrice)
      const totalTax = selectedProducts
        .reduce((tax, product) => {
          return tax + (product.price / 100) * product.tax;
        }, 0)
        .toFixed(2);
      // console.log(totalTax)
      setInvoiceFormData((previousData) => {
        return {
          ...previousData,
          tax: totalTax,
          total: totalPrice,
          grandTotal: Number(totalPrice) + Number(totalTax),
        };
      });
      setAddedProducts(selectedProducts);
    } else {
      toast.error("please select minimum one product");
    }
  };
  const handleInvoiceSubmit = (e) => {
    e.preventDefault();
    if (invoiceFormData.customerName && invoiceFormData.productList.length) {
      setInvoices((previousData) => {
        return [...previousData, invoiceFormData];
      });
      setShowCreateInvoice(false);
    } else {
      if (!invoiceFormData.customerName) {
        toast.error("enter customer name");
      } else {
        toast.error("enter products");
      }
    }
  };
  return (
    <div className="p-1 position-fixed top-50 start-50 translate-middle box-shadow bg-danger-subtle ">
      <h2 className="h5 text-light bg-danger p-1 m-0">Create Invoice</h2>
      <div>
        <Form onSubmit={handleInvoiceSubmit}>
          <div className="d-flex gap-3 flex-wrap">
            <div className="m-2">
              <label>
                Invoice No:{" "}
                <input
                  type="text"
                  disabled
                  name="invoiceNo"
                  value={invoiceFormData.invoiceNo}
                />
              </label>
            </div>
            <div className="m-2">
              <label>
                Date:{" "}
                <input
                  className="bg-secondary-subtle"
                  type="text"
                  disabled
                  name="invoiceDate"
                  value={invoiceFormData.invoiceDate}
                />
              </label>
            </div>
            <div className="m-2">
              <Form.Control
                type="text"
                name="customerName"
                onChange={handleInvoiceFormDataChange}
                value={invoiceFormData.customerName}
                placeholder="Customer Name"
              />
            </div>
          </div>
          <div className="text-end">
            <Button className="mx-3 m-2" variant="danger" onClick={handleShow}>
              Add Product
            </Button>
          </div>
          <div
            className="productInputTable overflow-y-scroll"
            style={{ maxHeight: "30vh" }}
          >
            {addedProducts.length ? (
              <Table striped hover responsive variant="warning">
                <thead>
                  <tr>
                    <th>Item ID</th>
                    <th>Item Name</th>
                    <th>Price</th>
                    <th>Tax</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {addedProducts.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.name}</td>
                      <td>{product.price}</td>
                      <td>{product.tax}%</td>
                      <td>{(product.price / 100) * 5 + product.price}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div className="text-center">No products added</div>
            )}
          </div>
          {addedProducts.length?(
            <div className="m-1">
            <div className="m-1">
              <label>
                Total Price:{" "}
                <input disabled type="text" value={invoiceFormData.total} />
              </label>
            </div>
            <div className="m-1">
              <label>
                Total Tax:{" "}
                <input disabled type="text" value={invoiceFormData.tax} />
              </label>
            </div>
            <div className="m-1">
              <label>
                Grand Total:{" "}
                <input
                  disabled
                  type="text"
                  value={invoiceFormData.grandTotal}
                />
              </label>
            </div>
          </div>
          ):null}
          <div className="text-end">
            <Button type="submit" className="mx-3 m-2" variant="danger">
              Save
            </Button>
          </div>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Add Product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="text-end m-2">
                <Form.Control
                  className="border border-2"
                  type="text"
                  placeholder="Search..."
                  value={searchProduct}
                  onChange={(e) => {
                    setSearchProduct(e.target.value);
                  }}
                />
              </div>
              <div className="m-2">
                <Table variant="danger" responsive striped hover>
                  <thead>
                    <tr>
                      <th>Item ID</th>
                      <th>Product Name</th>
                      <th>Price</th>
                      <th>Select</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productData
                      .filter((product) => {
                        if (searchProduct) {
                          const search = searchProduct.toLowerCase();
                          const productName = product.name.toLowerCase();
                          return productName.includes(search);
                        } else {
                          return true;
                        }
                      })
                      .map((product) => (
                        <tr key={product.id}>
                          <td>{product.id}</td>
                          <td>{product.name}</td>
                          <td>{product.price}</td>
                          <td>
                            <Form.Check
                              onChange={handleInvoiceFormDataChange}
                              checked={invoiceFormData.productList.includes(
                                product.id
                              )}
                              name="product"
                              value={product.id}
                              id={product.id}
                            />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleProductSave}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </Form>
      </div>
    </div>
  );
}
